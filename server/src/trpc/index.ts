import { createExpressMiddleware } from '@trpc/server/adapters/express';
import Logger from '../utils/logger.js';
import { userRouter } from './routes/user.route.js';
import { t } from '../container.js';
import { rssRouter } from './routes/rss.route.js';
import { feedConfigRouter } from './routes/feed.config.route.js';
import { createContext } from './context.js';
import { authRouter } from './routes/auth.route.js';
import { rssParserRouter } from './routes/rss.parser.route.js';
import { controlRouter } from './routes/control.route.js';
import { uiConfigRouter } from './routes/ui.config.route.js';
import { scheduleEventRouter } from './routes/scedule.event.route.js';

const appRouter = t.router({
  user: userRouter,
  rss: rssRouter,
  rssParser: rssParserRouter,
  feedConfig: feedConfigRouter,
  auth: authRouter,
  control: controlRouter,
  uiConfig: uiConfigRouter,
  scheduleEvent: scheduleEventRouter,
});

export type AppRouter = typeof appRouter;

export const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext,
  onError: ({ error }) => {
    Logger.error('tRPC error:', error);
  },
});
