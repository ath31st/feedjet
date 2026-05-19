import { t, integrationService } from '../../container.js';
import { handleServiceCall } from '../error.handler.js';
import { kioskIdInputSchema } from '../../validations/schemas/kiosk.schemas.js';
import { protectedProcedure } from '../../middleware/auth.js';
import {
  integrationCreateSchema,
  integrationPairCompleteSchema,
  integrationPairStartSchema,
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

  exists: protectedProcedure.input(kioskIdInputSchema).query(({ input }) => {
    return handleServiceCall(() => {
      return integrationService.exists(input.kioskId);
    });
  }),

  delete: protectedProcedure.input(kioskIdInputSchema).mutation(({ input }) =>
    handleServiceCall(() => {
      integrationService.delete(input.kioskId);
      return { success: true };
    }),
  ),

  pairPhilipsStart: protectedProcedure
    .input(integrationPairStartSchema)
    .mutation(({ input }) =>
      handleServiceCall(async () => {
        await integrationService.pairPhilipsStart(input.kioskId, input.ip);
        return { success: true };
      }),
    ),

  pairPhilipsComplete: protectedProcedure
    .input(integrationPairCompleteSchema)
    .mutation(({ input }) =>
      handleServiceCall(async () => {
        const integration = await integrationService.pairPhilipsComplete(
          input.kioskId,
          input.pin,
          input.description,
        );
        return integration;
      }),
    ),
});
