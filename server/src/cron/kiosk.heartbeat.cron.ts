import cron from 'node-cron';
import { createServiceLogger } from '../utils/pino.logger.js';
import { kioskHeartbeatService } from '../container.js';

const logger = createServiceLogger('kioskHeartbeatCron');
const cronSchedule = '0 0 * * *'; // Every day at midnight

export const startKioskHeartbeatCronJob = () => {
  cron.schedule(cronSchedule, async () => {
    kioskHeartbeatService.clear();
    logger.info(
      { fn: 'startKioskHeartbeatCronJob' },
      'Cleared kiosk heartbeats',
    );
  });
};
