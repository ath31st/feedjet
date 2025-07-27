import { createExpressMiddleware } from '@trpc/server/adapters/express';
import Logger from '../utils/logger.js';
import { userRouter } from './routes/user.route.js';
import { t } from '../container.js';
import { rssRouter } from './routes/rss.route.js';
import { kioskConfigRouter } from './routes/kiosk.config.route.js';
import { createContext } from './context.js';
import { authRouter } from './routes/auth.route.js';
import { rssParserRouter } from './routes/rss.parser.route.js';
import { controlRouter } from './routes/control.route.js';

const appRouter = t.router({
  user: userRouter,
  rss: rssRouter,
  rssParser: rssParserRouter,
  config: kioskConfigRouter,
  auth: authRouter,
  control: controlRouter,
});

export type AppRouter = typeof appRouter;

export const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext,
  onError: ({ error }) => {
    Logger.error('tRPC error:', error);
  },
});
