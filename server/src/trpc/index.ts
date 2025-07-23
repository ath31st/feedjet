import { createExpressMiddleware } from '@trpc/server/adapters/express';
import Logger from '../utils/logger.js';
import { userRouter } from './routes/users.js';
import { t } from '../container.js';

const appRouter = t.router({
  user: userRouter,
  //config: configRouter,
});

export const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext: () => ({}),
  onError: ({ error }) => {
    Logger.error('tRPC error:', error);
  },
});
