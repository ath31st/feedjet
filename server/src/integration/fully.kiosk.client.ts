import type { AxiosInstance } from 'axios';

export interface FullyKioskTarget {
  baseUrl: string;
  password: string;
}

export class FullyKioskClient {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  private async cmd(
    target: FullyKioskTarget,
    command: string,
    extraParams: Record<string, string | number | boolean> = {},
  ) {
    return this.http.get('/', {
      baseURL: target.baseUrl,
      params: {
        cmd: command,
        password: target.password,
        type: 'json',
        ...extraParams,
      },
    });
  }

  async screenOn(target: FullyKioskTarget) {
    return this.cmd(target, 'screenOn');
  }

  async screenOff(target: FullyKioskTarget) {
    return this.cmd(target, 'screenOff');
  }

  async getScreenshot(target: FullyKioskTarget): Promise<Buffer> {
    return this.http
      .get('/', {
        baseURL: target.baseUrl,
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
