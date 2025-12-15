import type { AxiosInstance } from 'axios';
import { createServiceLogger } from '../utils/pino.logger.js';

export interface FullyKioskTarget {
  ip: string;
  password: string;
}

export class FullyKioskClient {
  private readonly http: AxiosInstance;
  private readonly logger = createServiceLogger('fullyKioskClient');
  private readonly prefix = 'http://';
  private readonly port = 2323;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  private getBaseUrl(ip: string) {
    return `${this.prefix}${ip}:${this.port}`;
  }

  private async cmd(
    target: FullyKioskTarget,
    command: string,
    extraParams: Record<string, string | number | boolean> = {},
  ) {
    return this.http.get('/', {
      baseURL: this.getBaseUrl(target.ip),
      params: {
        cmd: command,
        password: target.password,
        type: 'json',
        ...extraParams,
      },
    });
  }

  async screenOn(target: FullyKioskTarget) {
    this.logger.debug({ target, fn: 'screenOn' }, 'Screen on');
    return this.cmd(target, 'screenOn');
  }

  async screenOff(target: FullyKioskTarget) {
    this.logger.debug({ target, fn: 'screenOff' }, 'Screen off');
    return this.cmd(target, 'screenOff');
  }

  async getScreenshot(target: FullyKioskTarget): Promise<Buffer> {
    this.logger.debug({ target, fn: 'getScreenshot' }, 'Get screenshot');
    return this.http
      .get('/', {
        baseURL: this.getBaseUrl(target.ip),
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
