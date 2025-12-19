import { t, integrationService } from '../../container.js';
import { handleServiceCall } from '../error.handler.js';
import { kioskIdInputSchema } from '../../validations/schemas/kiosk.schemas.js';
import { protectedProcedure } from '../../middleware/auth.js';
import {
  integrationCreateSchema,
  integrationUpdateSchema,
} from '../../validations/schemas/integration.schemas.js';

export const integrationRouter = t.router({
  getAll: protectedProcedure.query(() => {
    return handleServiceCall(() => {
      return integrationService.getAll();
    });
  }),

  getByKioskId: protectedProcedure
    .input(kioskIdInputSchema)
    .query(({ input }) => {
      return handleServiceCall(() => {
        return integrationService.getByKiosk(input.kioskId);
      });
    }),

  create: protectedProcedure
    .input(integrationCreateSchema)
    .mutation(({ input }) =>
      handleServiceCall(() => {
        const integration = integrationService.create(
          input.kioskId,
          input.data,
        );
        return integration;
      }),
    ),

  update: protectedProcedure
    .input(integrationUpdateSchema)
    .mutation(({ input }) =>
      handleServiceCall(() => {
        const integration = integrationService.update(
          input.kioskId,
          input.update,
        );
        return integration;
      }),
    ),

  delete: protectedProcedure.input(kioskIdInputSchema).mutation(({ input }) =>
    handleServiceCall(() => {
      integrationService.delete(input.kioskId);
      return { success: true };
    }),
  ),
});
