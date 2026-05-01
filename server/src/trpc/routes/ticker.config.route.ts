import { eventBus, t, tickerConfigService } from '../../container.js';
import { handleServiceCall } from '../error.handler.js';
import { kioskIdInputSchema } from '../../validations/schemas/kiosk.schemas.js';
import { protectedProcedure, publicProcedure } from '../../middleware/auth.js';
import {
  tickerConfigCreateInputSchema,
  tickerConfigUpdateInputSchema,
} from '../../validations/schemas/ticker.config.schemas.js';

export const tickerConfigRouter = t.router({
  getAll: publicProcedure.query(() => {
    return handleServiceCall(() => {
      return tickerConfigService.getAll();
    });
  }),

  getByKioskId: publicProcedure.input(kioskIdInputSchema).query(({ input }) => {
    return handleServiceCall(() => {
      return tickerConfigService.get(input.kioskId);
    });
  }),

  create: protectedProcedure
    .input(tickerConfigCreateInputSchema)
    .mutation(({ input }) => {
      return handleServiceCall(() => {
        const { kioskId, data } = input;
        return tickerConfigService.create(kioskId, data);
      });
    }),

  update: protectedProcedure
    .input(tickerConfigUpdateInputSchema)
    .mutation(({ input }) => {
      return handleServiceCall(() => {
        const { kioskId, data } = input;
        const updated = tickerConfigService.update(kioskId, data);

        eventBus.emit(`ticker-config:${updated.kioskId}`, updated);

        return updated;
      });
    }),

  delete: protectedProcedure.input(kioskIdInputSchema).mutation(({ input }) => {
    return handleServiceCall(() => {
      return tickerConfigService.delete(input.kioskId);
    });
  }),
});
