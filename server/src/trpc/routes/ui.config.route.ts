import { z } from 'zod';
import {
  t,
  eventBus,
  publicProcedure,
  uiConfigService,
} from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';
import { uiConfigUpdateSchema } from '../../validations/schemas/ui.config.schemas.js';
import { handleServiceCall } from '../error.handler.js';

export const uiConfigRouter = t.router({
  getUiConfig: publicProcedure.query(() =>
    handleServiceCall(() => {
      return uiConfigService.getConfig();
    }),
  ),

  update: protectedProcedure
    .input(
      z.object({
        data: uiConfigUpdateSchema,
      }),
    )
    .mutation(({ input }) =>
      handleServiceCall(() => {
        const updated = uiConfigService.update(input.data);
        eventBus.emit('ui-config', updated);
        return updated;
      }),
    ),
});
