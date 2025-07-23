import { TRPCError } from '@trpc/server';
import { t } from '../container.js';

export const protectedProcedure = t.procedure.use((opts) => {
  if (!opts.ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return opts.next({
    ctx: {
      user: opts.ctx.user,
    },
  });
});
