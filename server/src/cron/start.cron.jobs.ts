import { startDeviceCleanupCronJob } from './device.cleanup.cron.js';
import { startImageCacheCleanupJob } from './image.cache.cron.js';
import { startKioskWorkCron } from './kiosk.work.cron.js';
import { bindRssJobsToSseConnections } from './rss.cron.js';
import { startScreenStateCron } from './screen.state.cron.js';
import { startSseKeepAliveCron } from './sse.keep.alive.cron.js';

export function startCronJobs(): void {
  startImageCacheCleanupJob();
  startSseKeepAliveCron();
  startKioskWorkCron();
  startDeviceCleanupCronJob();
  startScreenStateCron();
  bindRssJobsToSseConnections();
}
