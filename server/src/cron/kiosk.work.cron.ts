import cron from 'node-cron';
import { createServiceLogger } from '../utils/pino.logger.js';
import {
  kioskService,
  kioskWorkScheduleService,
  deviceControlService,
  integrationService,
} from '../container.js';

const logger = createServiceLogger('kioskWorkCron');

const cronSchedule = '* * * * *'; // Run every minute
const CONTROL_TIMEOUT_MS = 15_000;

let cronRunning = false;

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  label: string,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`${label} timeout after ${timeoutMs}ms`)),
        timeoutMs,
      ),
    ),
  ]);
}

export function startKioskWorkCron(): void {
  cron.schedule(cronSchedule, async () => {
    if (cronRunning) {
      logger.warn(
        { fn: 'startKioskWorkCron' },
        'Skip: previous cron still running',
      );
      return;
    }

    cronRunning = true;

    logger.debug({ fn: 'startKioskWorkCron' }, 'Kiosk work cron job started');

    try {
      const activeKiosks = kioskService.getActive();

      if (activeKiosks.length === 0) {
        logger.debug({ fn: 'startKioskWorkCron' }, 'Skip: No active kiosks');
        return;
      }

      for (const kiosk of activeKiosks) {
        try {
          const { isEndTime, isStartTime, scheduleNotActive } =
            kioskWorkScheduleService.scheduleStatuses(kiosk.id);

          if (scheduleNotActive) {
            logger.debug(
              { slug: kiosk.slug, fn: 'startKioskWorkCron' },
              'Skip: Schedule not active for active kiosk',
            );
            continue;
          }

          const ips = integrationService.getIpsByKioskId(kiosk.id);

          if (ips.length === 0) {
            logger.debug(
              { slug: kiosk.slug, kioskId: kiosk.id, fn: 'startKioskWorkCron' },
              'Skip: No integration IPs found for active kiosk',
            );
            continue;
          }

          if (isStartTime || isEndTime) {
            for (const ip of ips) {
              (async () => {
                try {
                  if (isStartTime) {
                    await withTimeout(
                      deviceControlService.screenOn(ip),
                      CONTROL_TIMEOUT_MS,
                      'screenOn',
                    );
                    logger.info(
                      { kioskId: kiosk.id, ip, fn: 'startKioskWorkCron' },
                      'Screen ON command sent successfully',
                    );
                  } else if (isEndTime) {
                    await withTimeout(
                      deviceControlService.screenOff(ip),
                      CONTROL_TIMEOUT_MS,
                      'screenOff',
                    );
                    logger.info(
                      { kioskId: kiosk.id, ip, fn: 'startKioskWorkCron' },
                      'Screen OFF command sent successfully',
                    );
                  }
                } catch (err) {
                  logger.error(
                    {
                      err,
                      kioskId: kiosk.id,
                      ip,
                      fn: 'startKioskWorkCron',
                    },
                    'Failed to send command to specific IP (background)',
                  );
                }
              })();
            }
          }
        } catch (err) {
          logger.error(
            { err, kioskId: kiosk.id, fn: 'startKioskWorkCron' },
            'Failed to process kiosk work schedule',
          );
        }
      }
    } catch (err) {
      logger.error(
        { err, fn: 'startKioskWorkCron' },
        'Critical error in kiosk work cron',
      );
    } finally {
      cronRunning = false;

      logger.debug({ fn: 'startKioskWorkCron' }, 'Kiosk work cron finished');
    }
  });
}
