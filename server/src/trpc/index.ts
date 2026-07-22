import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { userRouter } from './routes/user.route.js';
import { t } from '../container.js';
import { rssRouter } from './routes/rss.route.js';
import { feedConfigRouter } from './routes/feed.config.route.js';
import { createContext } from './context.js';
import { authRouter } from './routes/auth.route.js';
import { controlRouter } from './routes/control.route.js';
import { uiConfigRouter } from './routes/ui.config.route.js';
import { scheduleEventRouter } from './routes/schedule.event.route.js';
import { imageCacheRouter } from './routes/image.cache.route.js';
import { weatherForecastRouter } from './routes/weather.forecast.route.js';
import { videoStorageRouter } from './routes/video.storage.route.js';
import { kioskRouter } from './routes/kiosk.route.js';
import { birthdayRouter } from './routes/birthday.route.js';
import { createServiceLogger } from '../utils/pino.logger.js';
import { tickerConfigRouter } from './routes/ticker.config.route.js';
import { birthdayBackgroundRouter } from './routes/birthday.background.route.js';
import { imageStorageRouter } from './routes/image.storage.route.js';
import { kioskWorkScheduleRouter } from './routes/kiosk.work.schedule.route.js';
import { integrationRouter } from './routes/integration.route.js';
import { birthdayWidgetTransformRouter } from './routes/birthday.widget.transform.route.js';
import { logRouter } from './routes/log.route.js';
import { ZodError } from 'zod';
import { scenarioRouter } from './routes/scenario.route.js';
import { mediaFolderRouter } from './routes/media.folder.route.js';
import { deviceRouter } from './routes/device.route.js';
import { logoStorageRouter } from './routes/logo.storage.route.js';
import { brandingConfigRouter } from './routes/branding.config.route.js';
import { appFeaturesRouter } from './routes/app.route.js';

const logger = createServiceLogger('trpc');

const appRouter = t.router({
  app: appFeaturesRouter,
  user: userRouter,
  rss: rssRouter,
  feedConfig: feedConfigRouter,
  auth: authRouter,
  control: controlRouter,
  device: deviceRouter,
  uiConfig: uiConfigRouter,
  brandingConfig: brandingConfigRouter,
  tickerConfig: tickerConfigRouter,
  scheduleEvent: scheduleEventRouter,
  imageCache: imageCacheRouter,
  image: imageStorageRouter,
  logo: logoStorageRouter,
  weather: weatherForecastRouter,
  videoFile: videoStorageRouter,
  kiosk: kioskRouter,
  birthday: birthdayRouter,
  birthdayWidgetTransform: birthdayWidgetTransformRouter,
  birthdayBackground: birthdayBackgroundRouter,
  kioskWorkSchedule: kioskWorkScheduleRouter,
  integration: integrationRouter,
  log: logRouter,
  scenario: scenarioRouter,
  mediaFolder: mediaFolderRouter,
});

export type AppRouter = typeof appRouter;

export const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext,
  onError: ({ error, path, type, ctx }) => {
    if (error.cause instanceof ZodError) {
      logger.warn(
        {
          requestId: ctx?.requestId,
          path,
          type,
          issues: error.cause.issues,
        },
        'TRPC validation error',
      );
      return;
    }

    logger.error(
      {
        requestId: ctx?.requestId,
        path,
        type,
        code: error.code,
        message: error.message,
      },
      'TRPC error',
    );
  },
});
