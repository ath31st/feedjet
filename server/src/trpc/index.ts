import { createExpressMiddleware } from '@trpc/server/adapters/express';
import Logger from '../utils/logger.js';
import { userRouter } from './routes/user.js';
import { t } from '../container.js';
import { rssRouter } from './routes/rss.js';
import { kioskConfigRouter } from './routes/kiosk.config.js';
import { createContext } from './context.js';
import { authRouter } from './routes/auth.js';

const appRouter = t.router({
  user: userRouter,
  rss: rssRouter,
  config: kioskConfigRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;

export const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext,
  onError: ({ error }) => {
    Logger.error('tRPC error:', error);
  },
});
