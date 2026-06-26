import crypto from 'node:crypto';
import https from 'node:https';
import { createServiceLogger } from '../utils/pino.logger.js';
import { PhilipsPairError } from '../errors/philips.pair.error.js';
import {
  PAIR_TIMEOUT_MS,
  PHILIPS_SECRET,
  PORT,
  REQUEST_TIMEOUT_MS,
} from '../config/philips.jointspace.client.config.js';

export interface PhilipsTarget {
  ip: string;
  deviceId: string;
  authKey: string;
}

export interface PairCompletion {
  deviceId: string;
  authKey: string;
}

type PowerState = 'On' | 'Standby';

interface PendingPair {
  ip: string;
  deviceId: string;
  authKey: string;
  timestamp: string;
  expiresAt: number;
}

interface DigestChallenge {
  realm: string;
  nonce: string;
  qop?: string;
  opaque?: string;
  algorithm?: string;
}

interface HttpResponse {
  status: number;
  headers: Record<string, string | string[] | undefined>;
  body: string;
}

export class PhilipsJointSpaceClient {
  private readonly logger = createServiceLogger('philipsJointSpaceClient');
  private readonly agent = new https.Agent({
    rejectUnauthorized: false,
    keepAlive: true,
  });
  private readonly pending = new Map<string, PendingPair>();

  async startPairing(ip: string): Promise<void> {
    this.logger.info(
      { ip, fn: 'startPairing' },
      'Starting Philips JointSpace pairing',
    );

    const deviceId = crypto.randomBytes(8).toString('hex');
    const device = this.buildDevice(deviceId);

    const res = await this.request(ip, {
      method: 'POST',
      pathname: '/6/pair/request',
      body: { scope: ['read', 'write', 'control'], device },
    });

    if (res.status !== 200) {
      throw new PhilipsPairError(
        `TV отклонил запрос pairing (status ${res.status})`,
      );
    }

    const parsed = this.parseJson(res.body);
    if (parsed?.error_id !== 'SUCCESS' || !parsed.auth_key) {
      throw new PhilipsPairError(
        `TV вернул ошибку: ${parsed?.error_text ?? 'неизвестная ошибка'}`,
      );
    }

    this.pending.set(ip, {
      ip,
      deviceId,
      authKey: String(parsed.auth_key),
      timestamp: String(parsed.timestamp),
      expiresAt: Date.now() + PAIR_TIMEOUT_MS,
    });

    this.logger.debug(
      { ip, fn: 'startPairing' },
      'Pairing initiated, awaiting PIN',
    );
  }

  async completePairing(ip: string, pin: string): Promise<PairCompletion> {
    this.logger.info(
      { fn: 'completePairing' },
      'Completing Philips JointSpace pairing',
    );

    const pending = this.pending.get(ip);
    if (!pending) {
      throw new PhilipsPairError(
        'Нет активной сессии привязки. Начните привязку заново.',
      );
    }
    if (pending.expiresAt < Date.now()) {
      this.pending.delete(ip);
      throw new PhilipsPairError('Сессия истекла. Начните привязку заново.');
    }

    const hmac = crypto.createHmac('sha256', PHILIPS_SECRET);
    hmac.update(pending.timestamp + pin);
    const signature = hmac.digest('base64');

    const device = this.buildDevice(pending.deviceId);
    const body = {
      auth: {
        auth_AppId: '1',
        pin,
        auth_timestamp: pending.timestamp,
        auth_signature: signature,
      },
      device,
    };

    const res = await this.requestWithDigest(pending.ip, {
      method: 'POST',
      pathname: '/6/pair/grant',
      body,
      user: pending.deviceId,
      pass: pending.authKey,
    });

    if (res.status !== 200) {
      this.pending.delete(ip);
      throw new PhilipsPairError(
        `TV отклонил grant (status ${res.status}). Проверьте PIN.`,
      );
    }

    const parsed = this.parseJson(res.body);
    if (parsed?.error_id !== 'SUCCESS') {
      this.pending.delete(ip);
      throw new PhilipsPairError(
        `Pairing не подтверждён: ${parsed?.error_text ?? 'неизвестная ошибка'}`,
      );
    }

    this.pending.delete(ip);
    return { deviceId: pending.deviceId, authKey: pending.authKey };
  }

  cancelPairing(ip: string): void {
    this.pending.delete(ip);
  }

  async getPowerState(target: PhilipsTarget): Promise<PowerState> {
    const res = await this.requestWithDigest(target.ip, {
      method: 'GET',
      pathname: '/6/powerstate',
      user: target.deviceId,
      pass: target.authKey,
    });

    if (res.status !== 200) {
      throw new Error(
        `Philips powerstate read failed: status ${res.status}, body ${res.body}`,
      );
    }

    const parsed = this.parseJson(res.body);
    const state = parsed?.powerstate;
    if (state !== 'On' && state !== 'Standby') {
      throw new Error(`Unexpected powerstate: ${res.body}`);
    }
    return state;
  }

  async setPowerState(target: PhilipsTarget, state: PowerState): Promise<void> {
    const res = await this.requestWithDigest(target.ip, {
      method: 'POST',
      pathname: '/6/powerstate',
      body: { powerstate: state },
      user: target.deviceId,
      pass: target.authKey,
    });

    if (res.status !== 200) {
      throw new Error(
        `Philips powerstate set ${state} failed: status ${res.status}, body ${res.body}`,
      );
    }
  }

  async screenOn(target: PhilipsTarget): Promise<void> {
    this.logger.debug(
      { targetIp: target.ip, fn: 'screenOn' },
      'Philips screen on',
    );
    await this.setPowerState(target, 'On');
  }

  async screenOff(target: PhilipsTarget): Promise<void> {
    this.logger.debug(
      { targetIp: target.ip, fn: 'screenOff' },
      'Philips screen off',
    );
    await this.setPowerState(target, 'Standby');
  }

  private buildDevice(deviceId: string) {
    return {
      device_name: 'feedjet',
      device_os: 'Linux',
      app_name: 'feedjet',
      type: 'native',
      app_id: 'feedjet-server',
      id: deviceId,
    };
  }

  private parseJson(body: string): Record<string, unknown> | null {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }

  private request(
    ip: string,
    opts: {
      method: string;
      pathname: string;
      body?: unknown;
      auth?: string;
    },
  ): Promise<HttpResponse> {
    return new Promise((resolve, reject) => {
      const data =
        opts.body == null ? null : Buffer.from(JSON.stringify(opts.body));
      const headers: Record<string, string | number> = {
        Accept: 'application/json',
      };
      if (data) {
        headers['Content-Type'] = 'application/json';
        headers['Content-Length'] = data.length;
      }
      if (opts.auth) headers.Authorization = opts.auth;

      const req = https.request(
        {
          host: ip,
          port: PORT,
          method: opts.method,
          path: opts.pathname,
          headers,
          agent: this.agent,
          timeout: REQUEST_TIMEOUT_MS,
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on('data', (c: Buffer) => chunks.push(c));
          res.on('end', () => {
            resolve({
              status: res.statusCode ?? 0,
              headers: res.headers,
              body: Buffer.concat(chunks).toString('utf8'),
            });
          });
        },
      );

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy(new Error('Philips JointSpace request timeout'));
      });
      if (data) req.write(data);
      req.end();
    });
  }

  private async requestWithDigest(
    ip: string,
    opts: {
      method: string;
      pathname: string;
      body?: unknown;
      user: string;
      pass: string;
    },
  ): Promise<HttpResponse> {
    const first = await this.request(ip, {
      method: opts.method,
      pathname: opts.pathname,
      body: opts.body,
    });
    if (first.status !== 401) return first;

    const wwwAuth = first.headers['www-authenticate'];
    const wwwAuthStr = Array.isArray(wwwAuth) ? wwwAuth[0] : wwwAuth;
    if (!wwwAuthStr) {
      throw new Error('Philips JointSpace: WWW-Authenticate missing on 401');
    }

    const challenge = this.parseDigestChallenge(wwwAuthStr);
    const auth = this.buildDigestAuthHeader({
      user: opts.user,
      pass: opts.pass,
      method: opts.method,
      uri: opts.pathname,
      challenge,
      bodyJson: opts.body == null ? null : JSON.stringify(opts.body),
    });

    return this.request(ip, {
      method: opts.method,
      pathname: opts.pathname,
      body: opts.body,
      auth,
    });
  }

  private parseDigestChallenge(header: string): DigestChallenge {
    const out: Record<string, string> = {};
    const cleaned = header.replace(/^Digest\s+/i, '');
    const re = /(\w+)=(?:"([^"]*)"|([^,]+))/g;
    for (;;) {
      const m = re.exec(cleaned);
      if (m === null) break;
      out[m[1]] = m[2] ?? m[3];
    }
    if (!out.realm || !out.nonce) {
      throw new Error(`Malformed Digest challenge: ${header}`);
    }
    return out as unknown as DigestChallenge;
  }

  private buildDigestAuthHeader(args: {
    user: string;
    pass: string;
    method: string;
    uri: string;
    challenge: DigestChallenge;
    bodyJson: string | null;
  }): string {
    const { user, pass, method, uri, challenge, bodyJson } = args;
    const qopList = (challenge.qop ?? '').split(',').map((s) => s.trim());
    const useAuthInt = qopList.includes('auth-int') && bodyJson != null;
    const qopChoice = useAuthInt
      ? 'auth-int'
      : qopList.includes('auth')
        ? 'auth'
        : '';
    const nc = '00000001';
    const cnonce = crypto.randomBytes(8).toString('hex');

    const md5 = (s: string) => crypto.createHash('md5').update(s).digest('hex');

    const ha1 = md5(`${user}:${challenge.realm}:${pass}`);
    const ha2 = useAuthInt
      ? md5(`${method}:${uri}:${md5(bodyJson ?? '')}`)
      : md5(`${method}:${uri}`);
    const response = qopChoice
      ? md5(`${ha1}:${challenge.nonce}:${nc}:${cnonce}:${qopChoice}:${ha2}`)
      : md5(`${ha1}:${challenge.nonce}:${ha2}`);

    let header =
      `Digest username="${user}", realm="${challenge.realm}", ` +
      `nonce="${challenge.nonce}", uri="${uri}", response="${response}"`;
    if (challenge.opaque) header += `, opaque="${challenge.opaque}"`;
    if (qopChoice) header += `, qop=${qopChoice}, nc=${nc}, cnonce="${cnonce}"`;
    if (challenge.algorithm) header += `, algorithm=${challenge.algorithm}`;
    return header;
  }
}
