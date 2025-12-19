import cron from 'node-cron';
import { createServiceLogger } from '../utils/pino.logger.js';
import {
  kioskService,
  kioskWorkScheduleService,
  integrationService,
  fullyKioskClient,
  kioskHeartbeatService,
} from '../container.js';
import { decrypt } from '../utils/crypto.js';
import type { Integration } from '@shared/types/integration.js';

const CRON_KIOSK_WORK = '* * * * *';
const logger = createServiceLogger('kioskWorkCron');

export function startKioskWorkCron(): void {
  cron.schedule(CRON_KIOSK_WORK, async () => {
    logger.debug({ fn: 'startKioskWorkCron' }, 'Kiosk work cron job executed');

    try {
      const dbKiosks = kioskService.getActive();
      const heartbeats = kioskHeartbeatService.getActiveKiosks();

      for (const kiosk of dbKiosks) {
        try {
          const heartbeat = heartbeats.find((hb) => hb.slug === kiosk.slug);

          if (!heartbeat || !heartbeat.ip) {
            logger.debug(
              { slug: kiosk.slug, fn: 'startKioskWorkCron' },
              'Skip: No heartbeat/IP found for active kiosk',
            );
            continue;
          }

          let integration: Integration;
          try {
            integration = integrationService.getByKiosk(kiosk.id);
          } catch (_e) {
            continue;
          }

          if (integration.type !== 'fully_kiosk' || !integration.passwordEnc) {
            logger.debug(
              { slug: kiosk.slug, fn: 'startKioskWorkCron' },
              'Skip: No fully kiosk integration found for active kiosk',
            );
            continue;
          }

          const isWorkingTime = kioskWorkScheduleService.isKioskActiveNow(
            kiosk.id,
          );

          const target = {
            ip: heartbeat.ip,
            password: decrypt(integration.passwordEnc),
          };

          if (isWorkingTime) {
            await fullyKioskClient.screenOn(target);
          } else {
            await fullyKioskClient.screenOff(target);
          }
        } catch (kioskError) {
          logger.error(
            { error: kioskError, kioskId: kiosk.id, fn: 'startKioskWorkCron' },
            'Failed to process kiosk work schedule',
          );
        }
      }
    } catch (globalError) {
      logger.error(
        { error: globalError, fn: 'startKioskWorkCron' },
        'Critical error in kiosk work cron',
      );
    }
  });
}
