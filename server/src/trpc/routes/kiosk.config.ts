import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { kioskConfigUpdateSchema } from '../../validations/schemas/kiosk.config.schemas.js';
import { t, kioskConfigService } from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';

export const kioskConfigRouter = t.router({
  getMainConfig: protectedProcedure.query(() => {
    const config = kioskConfigService.getMainConfig();
    if (!config) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Config not found' });
    }
    return config;
  }),

  getAllowedThemes: protectedProcedure.query(() => {
    return kioskConfigService.getAllowedThemes();
  }),

  update: protectedProcedure
    .input(
      z.object({
        data: kioskConfigUpdateSchema,
      }),
    )
    .mutation(({ input }) => {
      return kioskConfigService.update(input.data);
    }),
});
