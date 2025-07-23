import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  kioskConfigParamsSchema,
  kioskConfigUpdateSchema,
} from '../../validations/schemas/kiosk.config.schemas.js';
import { t, kioskConfigService } from '../../container.js';

export const kioskConfigRouter = t.router({
  getMainConfig: t.procedure.input(kioskConfigParamsSchema).query(() => {
    const config = kioskConfigService.getMainConfig();
    if (!config) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Config not found' });
    }
    return config;
  }),

  getAllowedThemes: t.procedure.query(() => {
    return kioskConfigService.getAllowedThemes();
  }),

  update: t.procedure
    .input(
      z.object({
        data: kioskConfigUpdateSchema,
      }),
    )
    .mutation(({ input }) => {
      return kioskConfigService.update(input.data);
    }),
});
