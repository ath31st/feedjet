import cron from 'node-cron';
import { createServiceLogger } from '../utils/pino.logger.js';
import {
  kioskService,
  kioskWorkScheduleService,
  kioskHeartbeatService,
  kioskControlService,
} from '../container.js';

const CRON_KIOSK_WORK = '* * * * *';
const logger = createServiceLogger('kioskWorkCron');

export function startKioskWorkCron(): void {
  cron.schedule(CRON_KIOSK_WORK, async () => {
    logger.info({ fn: 'startKioskWorkCron' }, 'Kiosk work cron job started');

    try {
      const activeKiosks = kioskService.getActive();
      const heartbeats = kioskHeartbeatService.getActiveKiosks();

      if (activeKiosks.length === 0) {
        logger.info({ fn: 'startKioskWorkCron' }, 'Skip: No active kiosks');
        return;
      }

      for (const kiosk of activeKiosks) {
        try {
          const heartbeat = heartbeats.find((hb) => hb.slug === kiosk.slug);

          if (!heartbeat || !heartbeat.ip) {
            logger.info(
              { slug: kiosk.slug, fn: 'startKioskWorkCron' },
              'Skip: No heartbeat/IP found for active kiosk',
            );
            continue;
          }

          const { isEndTime, isStartTime, scheduleNotActive } =
            kioskWorkScheduleService.scheduleStatuses(kiosk.id);

          if (scheduleNotActive) {
            logger.info(
              { slug: kiosk.slug, fn: 'startKioskWorkCron' },
              'Skip: Schedule not active for active kiosk',
            );
            continue;
          }

          if (isStartTime) {
            kioskControlService.screenOn(kiosk.id, heartbeat.ip);
            logger.info(
              { kioskId: kiosk.id, ip: heartbeat.ip },
              'Screen ON command sent',
            );
          } else if (isEndTime) {
            kioskControlService.screenOff(kiosk.id, heartbeat.ip);
            logger.info(
              { kioskId: kiosk.id, ip: heartbeat.ip },
              'Screen OFF command sent',
            );
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

    logger.info({ fn: 'startKioskWorkCron' }, 'Kiosk work cron job finished');
  });
}
