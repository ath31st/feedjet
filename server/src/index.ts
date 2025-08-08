import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Logger from './utils/logger.js';
import { trpcMiddleware } from './trpc/index.js';
import { startRssCronJob } from './cron/rss.cron.js';
import { feedSseHandler } from './sse/feed.handler.js';
import { feedConfigSseHandler } from './sse/feed.config.handler.js';
import { controlSseHandler } from './sse/control.handler.js';
import { uiConfigSseHandler } from './sse/ui.config.handler.js';
import { cacheDir } from './container.js';
import { startImageCacheCleanupJob } from './cron/image.cache.cron.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(
  '/cache',
  express.static(cacheDir, {
    maxAge: '3d',
  }),
);
app.use(cors());
app.use(express.json());
app.get('/sse/feed', feedSseHandler);
app.get('/sse/feed-config', feedConfigSseHandler);
app.get('/sse/ui-config', uiConfigSseHandler);
app.get('/sse/control', controlSseHandler);
app.use('/trpc', trpcMiddleware);

startRssCronJob();
startImageCacheCleanupJob();

app.listen(port, () => {
  Logger.info(`🚀 Server is running at http://localhost:${port}`);
});
