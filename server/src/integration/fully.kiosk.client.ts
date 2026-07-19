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
    const isScreenOn = res.data?.isScreenOn;

    if (typeof isScreenOn !== 'boolean') {
      throw new Error(`Unexpected deviceInfo screen state: ${res.data}`);
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
