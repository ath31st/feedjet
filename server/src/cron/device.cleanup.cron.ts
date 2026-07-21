import cron from 'node-cron';
import { deviceService } from '../container.js';
import { createServiceLogger } from '../utils/pino.logger.js';

const logger = createServiceLogger('deviceCleanupCron');

export const startDeviceCleanupCronJob = () => {
  // Run every day at 19:00
  const cronSchedule = process.env.DEVICE_CLEANUP_CRON_SCHEDULE ?? '0 19 * * *';
  // Delete devices older than 10 days
  const daysThreshold = parseInt(
    process.env.DEVICE_CLEANUP_DAYS_THRESHOLD ?? '10',
    10,
  );

  cron.schedule(cronSchedule, async () => {
    logger.info({ fn: 'startDeviceCleanupCronJob' }, 'Running device cleanup');

    try {
      const deleted = deviceService.deleteOldDevices(daysThreshold);
      logger.info(
        { deleted, fn: 'startDeviceCleanupCronJob' },
        'Device cleanup completed',
      );
    } catch (err) {
      logger.error(
        { err, fn: 'startDeviceCleanupCronJob' },
        'Device cleanup failed',
      );
    }
  });
};
