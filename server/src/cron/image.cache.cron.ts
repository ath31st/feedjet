import cron from 'node-cron';
import fs from 'node:fs/promises';
import path from 'node:path';
import { cacheDir } from '../config/config.js';
import { createServiceLogger } from '../utils/pino.logger.js';

const logger = createServiceLogger('imageCacheCron');

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const cronSchedule =
  process.env.IMAGE_CACHE_CLEANUP_CRON_SCHEDULE ?? '0 * * * *'; // Run every hour

export const startImageCacheCleanupJob = () => {
  cron.schedule(cronSchedule, async () => {
    logger.info(
      { fn: 'startImageCacheCleanupJob' },
      'Running image cache cleanup job...',
    );

    try {
      const files = await fs.readdir(cacheDir);
      const now = Date.now();
      let deleted = 0;

      for (const file of files) {
        const filePath = path.join(cacheDir, file);
        const stat = await fs.stat(filePath);

        if (now - stat.mtimeMs > MAX_AGE_MS) {
          await fs.unlink(filePath);
          deleted++;
        }
      }

      logger.info(
        {
          deleted,
          fn: 'startImageCacheCleanupJob',
        },
        `Image cleanup complete. Deleted ${deleted} old file(s).`,
      );
    } catch (err) {
      logger.error(
        { err, fn: 'startImageCacheCleanupJob' },
        'Failed to run image cache cleanup job',
      );
    }
  });
};
