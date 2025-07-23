import { createExpressMiddleware } from '@trpc/server/adapters/express';
import Logger from '../utils/logger.js';
import { userRouter } from './routes/user.js';
import { t } from '../container.js';
import { rssRouter } from './routes/rss.js';

const appRouter = t.router({
  user: userRouter,
  rss: rssRouter,
  //config: configRouter,
});

export const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext: () => ({}),
  onError: ({ error }) => {
    Logger.error('tRPC error:', error);
  },
});
