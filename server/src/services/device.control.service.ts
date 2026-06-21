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

export class DeviceControlService {
  private readonly integrationService: IntegrationService;
  private readonly fullyKioskClient: FullyKioskClient;
  private readonly adbClient: AdbClient;
  private readonly philipsClient: PhilipsJointSpaceClient;
  private readonly logger = createServiceLogger('deviceControlService');

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

    switch (integration.type) {
      case 'adb':
        await this.adbClient.screenOn({ ip });
        break;
      case 'fully_kiosk':
        await this.fullyKioskClient.screenOn({
          ip,
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
  }

  async screenOff(ip: string): Promise<void> {
    this.logger.debug({ ip, fn: 'screenOff' }, 'Requesting Screen OFF');

    const integration = this.integrationService.getByIp(ip);

    switch (integration.type) {
      case 'adb':
        await this.adbClient.screenOff({ ip });
        break;
      case 'fully_kiosk':
        await this.fullyKioskClient.screenOff({
          ip,
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
