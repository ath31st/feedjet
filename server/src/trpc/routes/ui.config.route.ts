import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  t,
  eventBus,
  publicProcedure,
  uiConfigService,
} from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';
import { uiConfigUpdateSchema } from '../../validations/schemas/ui.config.schemas.js';

export const uiConfigRouter = t.router({
  getUiConfig: publicProcedure.query(() => {
    const config = uiConfigService.getConfig();
    if (!config) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Config not found' });
    }
    return config;
  }),

  update: protectedProcedure
    .input(
      z.object({
        data: uiConfigUpdateSchema,
      }),
    )
    .mutation(({ input }) => {
      const updated = uiConfigService.update(input.data);
      if (!updated) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'UI Config not found',
        });
      }

      eventBus.emit('ui-config', updated);

      return updated;
    }),
});
