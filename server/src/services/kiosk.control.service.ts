import { createServiceLogger } from '../utils/pino.logger.js';
import type { IntegrationService } from './integration.service.js';
import type { FullyKioskClient } from '../integration/fully.kiosk.client.js';
import { decrypt } from '../utils/crypto.js';
import { KioskControlError } from '../errors/kiosk.control.error.js';
import type { AdbClient } from '../integration/adb.client.js';

export class KioskControlService {
  private readonly integrationService: IntegrationService;
  private readonly fullyKioskClient: FullyKioskClient;
  private readonly adbClient: AdbClient;
  private readonly logger = createServiceLogger('kioskControlService');

  constructor(
    integrationService: IntegrationService,
    fullyKioskClient: FullyKioskClient,
    adbClient: AdbClient,
  ) {
    this.integrationService = integrationService;
    this.fullyKioskClient = fullyKioskClient;
    this.adbClient = adbClient;
  }

  async screenOn(kioskId: number, ip: string): Promise<void> {
    this.logger.debug({ kioskId, ip, fn: 'screenOn' }, 'Requesting Screen ON');

    const integration = this.integrationService.getByKiosk(kioskId);

    switch (integration.type) {
      case 'adb':
        await this.adbClient.screenOn({ ip });
        break;
      case 'fully_kiosk':
        if (!integration.passwordEnc) {
          throw new KioskControlError(
            400,
            'Fully Kiosk integration requires a password',
          );
        }
        await this.fullyKioskClient.screenOn({
          ip,
          password: decrypt(integration.passwordEnc),
        });
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

  async screenOff(kioskId: number, ip: string): Promise<void> {
    this.logger.debug(
      { kioskId, ip, fn: 'screenOff' },
      'Requesting Screen OFF',
    );

    const integration = this.integrationService.getByKiosk(kioskId);

    switch (integration.type) {
      case 'adb':
        await this.adbClient.screenOff({ ip });
        break;
      case 'fully_kiosk':
        if (!integration.passwordEnc) {
          throw new Error('Fully Kiosk integration requires a password');
        }
        await this.fullyKioskClient.screenOff({
          ip,
          password: decrypt(integration.passwordEnc),
        });
        break;

      default:
        throw new KioskControlError(
          400,
          `Screen control not supported for ${integration.type}`,
        );
    }
  }
}
