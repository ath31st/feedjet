import type { AxiosInstance } from 'axios';
import { createServiceLogger } from '../utils/pino.logger.js';

export interface FullyKioskTarget {
  ip: string;
  port: number;
  password: string;
}

export class FullyKioskClient {
  private readonly http: AxiosInstance;
  private readonly logger = createServiceLogger('fullyKioskClient');
  private readonly prefix = 'http://';

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  private getBaseUrl(ip: string, port: number): string {
    return `${this.prefix}${ip}:${port}`;
  }

  private async cmd(
    target: FullyKioskTarget,
    command: string,
    extraParams: Record<string, string | number | boolean> = {},
  ) {
    return this.http.get('/', {
      baseURL: this.getBaseUrl(target.ip, target.port),
      params: {
        cmd: command,
        password: target.password,
        type: 'json',
        ...extraParams,
      },
    });
  }

  private normalizeBoolean(value: unknown): boolean | null {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'true' || normalized === 'on' || normalized === '1') {
        return true;
      }
      if (
        normalized === 'false' ||
        normalized === 'off' ||
        normalized === '0'
      ) {
        return false;
      }
    }

    if (typeof value === 'number') {
      if (value === 1) return true;
      if (value === 0) return false;
    }

    return null;
  }

  private extractScreenOnState(payload: unknown): boolean | null {
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const candidates = [
      (payload as Record<string, unknown>).isScreenOn,
      (payload as Record<string, unknown>).screenOn,
      (payload as Record<string, unknown>).screenStatus,
    ];

    for (const candidate of candidates) {
      const parsed = this.normalizeBoolean(candidate);
      if (parsed !== null) {
        return parsed;
      }
    }

    const nestedObjects = Object.values(payload as Record<string, unknown>).filter(
      (value) => value && typeof value === 'object',
    );

    for (const nested of nestedObjects) {
      const parsed = this.extractScreenOnState(nested);
      if (parsed !== null) {
        return parsed;
      }
    }

    return null;
  }

  async screenOn(target: FullyKioskTarget) {
    this.logger.debug(
      { targetIp: target.ip, port: target.port, fn: 'screenOn' },
      'Screen on (fully kiosk)',
    );
    return this.cmd(target, 'screenOn');
  }

  async screenOff(target: FullyKioskTarget) {
    this.logger.debug(
      { targetIp: target.ip, port: target.port, fn: 'screenOff' },
      'Screen off (fully kiosk)',
    );
    return this.cmd(target, 'screenOff');
  }

  async isScreenOn(target: FullyKioskTarget): Promise<boolean> {
    this.logger.debug(
      { targetIp: target.ip, port: target.port, fn: 'isScreenOn' },
      'Get screen state (fully kiosk)',
    );

    const res = await this.cmd(target, 'deviceInfo');
    const isScreenOn = this.extractScreenOnState(res.data);

    if (isScreenOn === null) {
      this.logger.debug(
        {
          targetIp: target.ip,
          port: target.port,
          payload: res.data,
          fn: 'isScreenOn',
        },
        'Fully deviceInfo payload (unparsed)',
      );

      const keys =
        res.data && typeof res.data === 'object'
          ? Object.keys(res.data as Record<string, unknown>).join(',')
          : 'non-object payload';
      throw new Error(`Unexpected deviceInfo screen state payload keys: ${keys}`);
    }

    return isScreenOn;
  }

  async getScreenshot(target: FullyKioskTarget): Promise<Buffer> {
    this.logger.debug(
      { targetIp: target.ip, fn: 'getScreenshot' },
      'Get screenshot (fully kiosk)',
    );
    return this.http
      .get('/', {
        baseURL: this.getBaseUrl(target.ip, target.port),
        params: {
          cmd: 'getScreenshot',
          password: target.password,
          time: Date.now(),
        },
        responseType: 'arraybuffer',
      })
      .then((r) => Buffer.from(r.data));
  }
}
