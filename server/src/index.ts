import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { trpcMiddleware } from './trpc/index.js';
import { startRssCronJob } from './cron/rss.cron.js';
import {
  birthdayBackgroundService,
  imageCacheService,
  imageStorageService,
  videoStorageService,
} from './container.js';
import { startImageCacheCleanupJob } from './cron/image.cache.cron.js';
import { createServiceLogger } from './utils/pino.logger.js';
import { unifiedSseHandler } from './sse/unified.sse.handlers.js';
import { startSseKeepAliveCron } from './cron/sse.keep.alive.cron.js';

const logger = createServiceLogger('main');

const app = express();
const port = process.env.PORT || 3000;

const cacheDir = imageCacheService.getCacheDir();
app.use(
  '/cache',
  express.static(cacheDir, {
    maxAge: '3d',
  }),
);
const videoStorageBaseDir = videoStorageService.getBaseDir();
app.use('/videos', express.static(videoStorageBaseDir));
const imageStorageBaseDir = imageStorageService.getBaseDir();
app.use('/images', express.static(imageStorageBaseDir));
const backgroundStorageDir = birthdayBackgroundService.getBaseDir();
app.use('/backgrounds', express.static(backgroundStorageDir));
app.use(cors());
app.use('/trpc', trpcMiddleware);
app.use(express.json());
app.get('/sse/stream/:kioskId', unifiedSseHandler);

startRssCronJob();
startImageCacheCleanupJob();
startSseKeepAliveCron();

app.listen(port, () => {
  logger.info(
    { fn: 'main', port },
    `🚀 Server is running at http://localhost:${port}`,
  );
});
