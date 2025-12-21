import cron from 'node-cron';
import { createServiceLogger } from '../utils/pino.logger.js';
import {
  kioskService,
  kioskWorkScheduleService,
  fullyKioskClient,
  kioskHeartbeatService,
} from '../container.js';
import { decrypt } from '../utils/crypto.js';

const CRON_KIOSK_WORK = '* * * * *';
const logger = createServiceLogger('kioskWorkCron');

export function startKioskWorkCron(): void {
  cron.schedule(CRON_KIOSK_WORK, async () => {
    logger.debug({ fn: 'startKioskWorkCron' }, 'Kiosk work cron job executed');

    try {
      const dbKiosks = kioskService.getActiveWithIntegration();
      const heartbeats = kioskHeartbeatService.getActiveKiosks();

      if (dbKiosks.length === 0) {
        logger.debug({ fn: 'startKioskWorkCron' }, 'Skip: No active kiosks');
        return;
      }

      for (const { kiosk, integration } of dbKiosks) {
        try {
          const heartbeat = heartbeats.find((hb) => hb.slug === kiosk.slug);

          if (!heartbeat || !heartbeat.ip) {
            logger.debug(
              { slug: kiosk.slug, fn: 'startKioskWorkCron' },
              'Skip: No heartbeat/IP found for active kiosk',
            );
            continue;
          }

          if (integration.type !== 'fully_kiosk' || !integration.passwordEnc) {
            logger.debug(
              { slug: kiosk.slug, fn: 'startKioskWorkCron' },
              'Skip: No fully kiosk integration found for active kiosk',
            );
            continue;
          }

          const { isEndTime, isStartTime, scheduleNotActive } =
            kioskWorkScheduleService.scheduleStatuses(kiosk.id);

          if (scheduleNotActive) {
            logger.debug(
              { slug: kiosk.slug, fn: 'startKioskWorkCron' },
              'Skip: Schedule not active for active kiosk',
            );
            continue;
          }

          const target = {
            ip: heartbeat.ip,
            password: decrypt(integration.passwordEnc),
          };

          if (isStartTime) {
            await fullyKioskClient.screenOn(target);
          } else if (isEndTime) {
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
