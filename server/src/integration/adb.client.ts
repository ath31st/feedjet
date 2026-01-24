import { createServiceLogger } from '../utils/pino.logger.js';
const AdbModule = await import('@devicefarmer/adbkit');
const Adb = AdbModule.Adb ?? AdbModule.default ?? AdbModule;

export interface AdbTarget {
  ip: string;
}

export class AdbClient {
  private readonly client = Adb.createClient();
  private readonly logger = createServiceLogger('adbClient');
  private readonly defaultPort = 5555;

  private async getDevice(target: AdbTarget) {
    const serial = `${target.ip}:${this.defaultPort}`;

    const devices = await this.client.listDevices();
    const exists = devices.some((d: { id: string }) => d.id === serial);

    if (!exists) {
      await this.client.connect(target.ip, this.defaultPort);
    }

    return this.client.getDevice(serial);
  }

  private async cmd(
    target: AdbTarget,
    command: string,
    timeoutMs = 5000,
  ): Promise<string> {
    this.logger.debug({ targetIp: target.ip, command }, 'ADB shell');

    const device = await this.getDevice(target);

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
    const device = await this.getDevice(target);
    const stream = await device.screencap();

    return Adb.util.readAll(stream);
  }

  async reboot(target: AdbTarget) {
    this.logger.info({ targetIp: target.ip, fn: 'reboot' }, 'Reboot device');

    const device = await this.getDevice(target);
    return device.reboot();
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
