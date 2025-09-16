import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Logger from './utils/logger.js';
import { trpcMiddleware } from './trpc/index.js';
import { startRssCronJob } from './cron/rss.cron.js';
import { imageCacheService, videoStorageService } from './container.js';
import { startImageCacheCleanupJob } from './cron/image.cache.cron.js';
import {
  controlSseHandler,
  feedConfigSseHandler,
  feedSseHandler,
  uiConfigSseHandler,
  videoSseHandler,
} from './sse/sse.handlers.js';

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
app.use('/video', express.static(videoStorageBaseDir));
app.use(cors());
app.use('/trpc', trpcMiddleware);
app.use(express.json());
app.get('/sse/feed', feedSseHandler);
app.get('/sse/feed-config', feedConfigSseHandler);
app.get('/sse/ui-config', uiConfigSseHandler);
app.get('/sse/control', controlSseHandler);
app.get('/sse/video', videoSseHandler);

startRssCronJob();
startImageCacheCleanupJob();

app.listen(port, () => {
  Logger.info(`🚀 Server is running at http://localhost:${port}`);
});
