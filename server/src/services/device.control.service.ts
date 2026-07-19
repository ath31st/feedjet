import { createServiceLogger } from '../utils/pino.logger.js';
import type { IntegrationService } from './integration.service.js';
import type { FullyKioskClient } from '../integration/fully.kiosk.client.js';
import { decrypt } from '../utils/crypto.js';
import { KioskControlError } from '../errors/kiosk.control.error.js';
import type { AdbClient } from '../integration/adb.client.js';
import type {
  PhilipsJointSpaceClient,
  PhilipsTarget,
} from '../integration/philips.jointspace.client.js';
import type {
  FullyKioskConfig,
  Integration,
  PhilipsJointspaceConfig,
} from '@shared/types/integration.js';
import type { ScreenState } from '@shared/types/screen.state.js';
import { LRUCache } from 'lru-cache';
import { isErrorWithMessage } from '../utils/is.error.with.message.js';

export class DeviceControlService {
  private readonly integrationService: IntegrationService;
  private readonly fullyKioskClient: FullyKioskClient;
  private readonly adbClient: AdbClient;
  private readonly philipsClient: PhilipsJointSpaceClient;
  private readonly logger = createServiceLogger('deviceControlService');
  private readonly requestTimeoutMs = 3000;
  private readonly screenStateCache = new LRUCache<string, ScreenState>({
    max: 100,
    ttl: 60_000,
  });

  constructor(
    integrationService: IntegrationService,
    fullyKioskClient: FullyKioskClient,
    adbClient: AdbClient,
    philipsClient: PhilipsJointSpaceClient,
  ) {
    this.integrationService = integrationService;
    this.fullyKioskClient = fullyKioskClient;
    this.adbClient = adbClient;
    this.philipsClient = philipsClient;
  }

  async screenOn(ip: string): Promise<void> {
    this.logger.debug({ ip, fn: 'screenOn' }, 'Requesting Screen ON');

    const integration = this.integrationService.getByIp(ip);
    const port = integration.port;

    switch (integration.type) {
      case 'adb':
        await this.adbClient.screenOn({ ip, port });
        break;
      case 'fully_kiosk':
        await this.fullyKioskClient.screenOn({
          ip,
          port,
          password: decrypt((integration.config as FullyKioskConfig).password),
        });
        break;
      case 'philips_jointspace':
        await this.philipsClient.screenOn(
          this.buildPhilipsTarget(integration, ip),
        );
        break;

      default:
        this.logger.warn(
          { type: integration.type, fn: 'screenOn' },
          'Unsupported integration type for screen control',
        );
        throw new KioskControlError(
          400,
          `Screen control not supported for ${integration.type}`,
        );
    }

    this.screenStateCache.set(ip, 'on');
  }

  async screenOff(ip: string): Promise<void> {
    this.logger.debug({ ip, fn: 'screenOff' }, 'Requesting Screen OFF');

    const integration = this.integrationService.getByIp(ip);
    const port = integration.port;

    switch (integration.type) {
      case 'adb':
        await this.adbClient.screenOff({ ip, port });
        break;
      case 'fully_kiosk':
        await this.fullyKioskClient.screenOff({
          ip,
          port,
          password: decrypt((integration.config as FullyKioskConfig).password),
        });
        break;
      case 'philips_jointspace':
        await this.philipsClient.screenOff(
          this.buildPhilipsTarget(integration, ip),
        );
        break;

      default:
        throw new KioskControlError(
          400,
          `Screen control not supported for ${integration.type}`,
        );
    }

    this.screenStateCache.set(ip, 'off');
  }

  getScreenStates(): Record<string, ScreenState> {
    const ips = [
      ...new Set(this.integrationService.getAll().map((i) => i.ip)),
    ];

    return Object.fromEntries(
      ips.map((ip) => [ip, this.screenStateCache.get(ip) ?? 'unreachable']),
    );
  }

  async refreshScreenState(ip: string): Promise<ScreenState> {
    try {
      const integration = this.integrationService.getByIp(ip);
      const state = await this.withTimeout(
        this.fetchScreenState(integration, ip),
      );
      this.screenStateCache.set(ip, state);
      return state;
    } catch (err: unknown) {
      const reason = isErrorWithMessage(err) ? err.message : 'unknown error';

      this.logger.debug(
        { ip, reason, fn: 'refreshScreenState' },
        'Screen state unreachable',
      );

      const unreachable: ScreenState = 'unreachable';
      this.screenStateCache.set(ip, unreachable);
      return unreachable;
    }
  }

  private async fetchScreenState(
    integration: Integration,
    ip: string,
  ): Promise<'on' | 'off'> {
    const port = integration.port;

    switch (integration.type) {
      case 'adb': {
        const on = await this.adbClient.isScreenOn({ ip, port });
        return on ? 'on' : 'off';
      }
      case 'fully_kiosk': {
        const on = await this.fullyKioskClient.isScreenOn({
          ip,
          port,
          password: decrypt((integration.config as FullyKioskConfig).password),
        });
        return on ? 'on' : 'off';
      }
      case 'philips_jointspace': {
        const power = await this.philipsClient.getPowerState(
          this.buildPhilipsTarget(integration, ip),
        );
        return power === 'On' ? 'on' : 'off';
      }
      default:
        throw new KioskControlError(
          400,
          `Screen state not supported for ${integration.type}`,
        );
    }
  }

  private async withTimeout<T>(promise: Promise<T>): Promise<T> {
    let timeoutId: NodeJS.Timeout | undefined;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('TIMEOUT'));
      }, this.requestTimeoutMs);
    });

    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  private buildPhilipsTarget(
    integration: Integration,
    ip: string,
  ): PhilipsTarget {
    const philipsConfig = integration.config as PhilipsJointspaceConfig;

    if (!philipsConfig.deviceId || !philipsConfig.authKey) {
      throw new KioskControlError(
        400,
        'Philips JointSpace integration is not paired',
      );
    }
    return {
      ip,
      deviceId: philipsConfig.deviceId,
      authKey: decrypt(philipsConfig.authKey),
    };
  }
}
