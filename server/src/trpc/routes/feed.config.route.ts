import { TRPCError } from '@trpc/server';
import {
  feedConfigGetInputSchema,
  feedConfigUpdateInputSchema,
} from '../../validations/schemas/feed.config.schemas.js';
import {
  t,
  feedConfigService,
  eventBus,
  publicProcedure,
} from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';
import { handleServiceCall } from '../error.handler.js';

export const feedConfigRouter = t.router({
  getConfig: publicProcedure
    .input(feedConfigGetInputSchema)
    .query(({ input }) => {
      const config = feedConfigService.getConfig(input.kioskId);
      if (!config) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Config not found' });
      }
      return config;
    }),

  update: protectedProcedure
    .input(feedConfigUpdateInputSchema)
    .mutation(({ input }) =>
      handleServiceCall(() => {
        const updated = feedConfigService.update(input.kioskId, input.data);
        eventBus.emit('feed-config', updated);
        return updated;
      }),
    ),
});
