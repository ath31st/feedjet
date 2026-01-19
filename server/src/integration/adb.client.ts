import { createServiceLogger } from '../utils/pino.logger.js';

export interface AdbTarget {
  ip: string;
}

import * as AdbLib from '@devicefarmer/adbkit';

const Adb =
  // biome-ignore lint/suspicious/noExplicitAny: stupid lib structure
  (AdbLib as any).default?.Adb ||
  // biome-ignore lint/suspicious/noExplicitAny: stupid lib structure
  (AdbLib as any).Adb ||
  // biome-ignore lint/suspicious/noExplicitAny: stupid lib structure
  (AdbLib as any).default;

export class AdbClient {
  private readonly client = Adb.createClient();
  private readonly logger = createServiceLogger('adbClient');
  private readonly defaultPort = 5555;

  private getDevice(target: AdbTarget) {
    return this.client.getDevice(`${target.ip}:${this.defaultPort}`);
  }

  private async cmd(
    target: AdbTarget,
    command: string,
    timeoutMs = 5000,
  ): Promise<string> {
    this.logger.debug({ targetIp: target.ip, command }, 'ADB shell');

    const device = this.getDevice(target);

    const exec = async () => {
      const stream = await device.shell(command);
      const buffer = await Adb.util.readAll(stream);
      return buffer.toString('utf-8').trim();
    };

    return Promise.race([
      exec(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('ADB shell timeout')), timeoutMs),
      ),
    ]);
  }

  async screenOn(target: AdbTarget) {
    this.logger.debug({ targetIp: target.ip, fn: 'screenOn' }, 'Screen ON');
    const state = await this.cmd(
      target,
      'dumpsys power | grep "mHoldingDisplaySuspendBlocker"',
    );
    if (!state.includes('true')) {
      await this.cmd(target, 'input keyevent 26');
    }
  }

  async screenOff(target: AdbTarget) {
    this.logger.debug({ targetIp: target.ip, fn: 'screenOff' }, 'Screen OFF');
    const state = await this.cmd(
      target,
      'dumpsys power | grep "mHoldingDisplaySuspendBlocker"',
    );
    if (state.includes('true')) {
      await this.cmd(target, 'input keyevent 26');
    }
  }

  async getScreenshot(target: AdbTarget): Promise<Buffer> {
    this.logger.debug(
      { targetIp: target.ip, fn: 'getScreenshot' },
      'Get screenshot',
    );
    const stream = await this.getDevice(target).screencap();
    return Adb.util.readAll(stream);
  }

  async reboot(target: AdbTarget) {
    this.logger.info({ targetIp: target.ip, fn: 'reboot' }, 'Reboot device');
    return this.getDevice(target).reboot();
  }

  async connect(target: AdbTarget) {
    this.logger.info({ targetIp: target.ip, fn: 'connect' }, 'ADB connect');
    return this.client.connect(target.ip, this.defaultPort);
  }

  async disconnect(target: AdbTarget) {
    this.logger.info(
      { targetIp: target.ip, fn: 'disconnect' },
      'ADB disconnect',
    );
    return this.client.disconnect(target.ip, this.defaultPort);
  }
}
