import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { trpcMiddleware } from './trpc/index.js';
import { startRssCronJob } from './cron/rss.cron.js';
import {
  birthdayFileService,
  imageCacheService,
  videoStorageService,
} from './container.js';
import { startImageCacheCleanupJob } from './cron/image.cache.cron.js';
import {
  controlSseHandler,
  feedConfigSseHandler,
  feedSseHandler,
  uiConfigSseHandler,
  videoSseHandler,
} from './sse/sse.handlers.js';
import { createServiceLogger } from './utils/pino.logger.js';

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
const backgroundsStorageDir = birthdayFileService.getBaseDir();
app.use('/backgrounds', express.static(backgroundsStorageDir));
app.use(cors());
app.use('/trpc', trpcMiddleware);
app.use(express.json());
app.get('/sse/feed', feedSseHandler);
app.get('/sse/feed-config/:kioskId', feedConfigSseHandler);
app.get('/sse/ui-config/:kioskId', uiConfigSseHandler);
app.get('/sse/control/:kioskId', controlSseHandler);
app.get('/sse/video', videoSseHandler);

startRssCronJob();
startImageCacheCleanupJob();

app.listen(port, () => {
  logger.info(
    { fn: 'main', port },
    `🚀 Server is running at http://localhost:${port}`,
  );
});
