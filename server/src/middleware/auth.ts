import { TRPCError } from '@trpc/server';
import { t } from '../container.js';
import { requestLogContext } from '../utils/pino.logger.js';

const withRequestId = t.middleware(async ({ ctx, next }) => {
  return requestLogContext.run({ requestId: ctx.requestId }, () => next());
});

export const publicProcedure = t.procedure.use(withRequestId);

export const protectedProcedure = t.procedure.use(withRequestId).use((opts) => {
  if (!opts.ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return opts.next({
    ctx: {
      ...opts.ctx,
      user: opts.ctx.user,
    },
  });
});
