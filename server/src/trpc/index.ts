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
  image: imageCacheRouter,
  weather: weatherForecastRouter,
  videoFile: videoStorageRouter,
  kiosk: kioskRouter,
  kioskHeartbeat: kioskHeartbeatRouter,
  birthday: birthdayRouter,
  birthdayBackground: birthdayBackgroundRouter,
});

export type AppRouter = typeof appRouter;

export const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext,
  onError: ({ error }) => {
    logger.error({ error, fn: 'createExpressMiddleware' }, 'TRPC error');
  },
});
