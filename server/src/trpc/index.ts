import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { userRouter } from './routes/user.route.js';
import { t } from '../container.js';
import { rssRouter } from './routes/rss.route.js';
import { feedConfigRouter } from './routes/feed.config.route.js';
import { createContext } from './context.js';
import { authRouter } from './routes/auth.route.js';
import { rssParserRouter } from './routes/rss.parser.route.js';
import { controlRouter } from './routes/control.route.js';
import { uiConfigRouter } from './routes/ui.config.route.js';
import { scheduleEventRouter } from './routes/schedule.event.route.js';
import { imageCacheRouter } from './routes/image.cache.route.js';
import { weatherForecastRouter } from './routes/weather.forecast.route.js';
import { videoStorageRouter } from './routes/video.storage.route.js';
import { kioskRouter } from './routes/kiosk.route.js';
import { birthdayRouter } from './routes/birthday.route.js';
import { createServiceLogger } from '../utils/pino.logger.js';
import { birthdayBackgroundRouter } from './routes/birthday.background.route.js';
import { kioskHeartbeatRouter } from './routes/kiosk.heartbeat.route.js';
import { imageStorageRouter } from './routes/image.storage.route.js';
import { kioskWorkScheduleRouter } from './routes/kiosk.work.schedule.route.js';
import { integrationRouter } from './routes/integration.route.js';
import { birthdayWidgetTransformRouter } from './routes/birthday.widget.transform.route.js';
import { logRouter } from './routes/log.route.js';

const logger = createServiceLogger('trpc');

const appRouter = t.router({
  user: userRouter,
  rss: rssRouter,
  rssParser: rssParserRouter,
  feedConfig: feedConfigRouter,
  auth: authRouter,
  control: controlRouter,
  uiConfig: uiConfigRouter,
  scheduleEvent: scheduleEventRouter,
  imageCache: imageCacheRouter,
  image: imageStorageRouter,
  weather: weatherForecastRouter,
  videoFile: videoStorageRouter,
  kiosk: kioskRouter,
  kioskHeartbeat: kioskHeartbeatRouter,
  birthday: birthdayRouter,
  birthdayWidgetTransform: birthdayWidgetTransformRouter,
  birthdayBackground: birthdayBackgroundRouter,
  kioskWorkSchedule: kioskWorkScheduleRouter,
  integration: integrationRouter,
  log: logRouter,
});

export type AppRouter = typeof appRouter;

export const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext,
  onError: ({ error }) => {
    logger.error({ error, fn: 'createExpressMiddleware' }, 'TRPC error');
  },
});
