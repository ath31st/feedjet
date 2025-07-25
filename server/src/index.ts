import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Logger from './utils/logger.js';
import { trpcMiddleware } from './trpc/index.js';
import { startRssCronJob } from './cron/rss.cron.js';
import { feedSseHandler } from './sse/feed.handler.js';
import { configSseHandler } from './sse/kiosk.config.handler.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.get('/sse/feed', feedSseHandler);
app.get('/sse/config', configSseHandler);
app.use('/trpc', trpcMiddleware);

startRssCronJob();

app.listen(port, () => {
  Logger.log(`🚀 Server is running at http://localhost:${port}`);
});
