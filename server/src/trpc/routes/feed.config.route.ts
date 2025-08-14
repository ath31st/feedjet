import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { feedConfigUpdateSchema } from '../../validations/schemas/feed.config.schemas.js';
import {
  t,
  feedConfigService,
  eventBus,
  publicProcedure,
} from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';
import { handleServiceCall } from '../error.handler.js';

export const feedConfigRouter = t.router({
  getConfig: publicProcedure.query(() => {
    const config = feedConfigService.getConfig();
    if (!config) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Config not found' });
    }
    return config;
  }),

  update: protectedProcedure
    .input(z.object({ data: feedConfigUpdateSchema }))
    .mutation(({ input }) =>
      handleServiceCall(() => {
        const updated = feedConfigService.update(input.data);
        eventBus.emit('feed-config', updated);
        return updated;
      }),
    ),
});
