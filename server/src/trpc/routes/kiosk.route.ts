import { t, kioskService, eventBus, publicProcedure } from '../../container.js';
import { handleServiceCall } from '../error.handler.js';
import {
  kioskIdInputSchema,
  kioskSlugInputSchema,
  newKioskSchema,
} from '../../validations/schemas/kiosk.schemas.js';
import { protectedProcedure } from '../../middleware/auth.js';

export const kioskRouter = t.router({
  getAll: publicProcedure.query(() => {
    return kioskService.getAll();
  }),

  getBySlug: publicProcedure.input(kioskSlugInputSchema).query(({ input }) => {
    return handleServiceCall(() => {
      try {
        return kioskService.getBySlug(input.slug);
      } catch (_err) {
        return kioskService.getBySlug('default');
      }
    });
  }),

  create: protectedProcedure.input(newKioskSchema).mutation(({ input }) =>
    handleServiceCall(() => {
      const kiosk = kioskService.create(input);
      eventBus.emit('kiosk-created', kiosk);
      return kiosk;
    }),
  ),

  delete: protectedProcedure.input(kioskIdInputSchema).mutation(({ input }) =>
    handleServiceCall(() => {
      kioskService.delete(input.kioskId);
      return { success: true };
    }),
  ),

  deleteBySlug: protectedProcedure
    .input(kioskSlugInputSchema)
    .mutation(({ input }) =>
      handleServiceCall(() => {
        kioskService.deleteBySlug(input.slug);
        eventBus.emit('kiosk-deleted', { slug: input.slug });
        return { success: true };
      }),
    ),
});
