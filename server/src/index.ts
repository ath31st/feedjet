import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
import Logger from './utils/logger.js';
import { trpcMiddleware } from './trpc/index.js';
import { startRssCronJob } from './cron/rss.cron.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/trpc', trpcMiddleware);
app.use(userRoutes);

startRssCronJob();

app.listen(port, () => {
  Logger.log(`🚀 Server is running at http://localhost:${port}`);
});
