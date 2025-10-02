import {
  t,
  eventBus,
  publicProcedure,
  uiConfigService,
} from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';
import {
  uiConfigGetInputSchema,
  uiConfigUpdateInputSchema,
} from '../../validations/schemas/ui.config.schemas.js';
import { handleServiceCall } from '../error.handler.js';

export const uiConfigRouter = t.router({
  getUiConfig: publicProcedure
    .input(uiConfigGetInputSchema)
    .query(({ input }) =>
      handleServiceCall(() => {
        return uiConfigService.getConfig(input.kioskId);
      }),
    ),

  update: protectedProcedure
    .input(uiConfigUpdateInputSchema)
    .mutation(({ input }) =>
      handleServiceCall(() => {
        const updated = uiConfigService.update(input.kioskId, input.data);
        eventBus.emit(`ui-config:${updated.kioskId}`, updated);
        return updated;
      }),
    ),
});
