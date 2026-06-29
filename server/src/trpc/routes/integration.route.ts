import { t, integrationService } from '../../container.js';
import { handleServiceCall } from '../error.handler.js';
import { protectedProcedure } from '../../middleware/auth.js';
import {
  integrationCreateSchema,
  integrationIdInputSchema,
  integrationIpInputSchema,
  integrationPairCompleteSchema,
  integrationPairStartSchema,
  integrationUpdateSchema,
  kioskIdInputSchema,
} from '../../validations/schemas/integration.schemas.js';

export const integrationRouter = t.router({
  getAll: protectedProcedure.query(() => {
    return handleServiceCall(() => {
      return integrationService.getAll();
    });
  }),

  getById: protectedProcedure
    .input(integrationIdInputSchema)
    .query(({ input }) => {
      return handleServiceCall(() => {
        return integrationService.getById(input.integrationId);
      });
    }),

  getByIp: protectedProcedure
    .input(integrationIpInputSchema)
    .query(({ input }) => {
      return handleServiceCall(() => {
        return integrationService.getByIp(input.ip);
      });
    }),

  create: protectedProcedure
    .input(integrationCreateSchema)
    .mutation(({ input }) =>
      handleServiceCall(() => {
        const integration = integrationService.create(input.data);
        return integration;
      }),
    ),

  update: protectedProcedure
    .input(integrationUpdateSchema)
    .mutation(({ input }) =>
      handleServiceCall(() => {
        const integration = integrationService.update(input.data);
        return integration;
      }),
    ),

  existsByKioskId: protectedProcedure
    .input(kioskIdInputSchema)
    .query(({ input }) => {
      return handleServiceCall(() => {
        return integrationService.existsByKioskId(input.kioskId);
      });
    }),

  existsByIp: protectedProcedure
    .input(integrationIpInputSchema)
    .query(({ input }) => {
      return handleServiceCall(() => {
        return integrationService.existsByIp(input.ip);
      });
    }),

  delete: protectedProcedure
    .input(integrationIdInputSchema)
    .mutation(({ input }) =>
      handleServiceCall(() => {
        integrationService.delete(input.integrationId);
        return { success: true };
      }),
    ),

  pairPhilipsStart: protectedProcedure
    .input(integrationPairStartSchema)
    .mutation(({ input }) =>
      handleServiceCall(async () => {
        await integrationService.pairPhilipsStart(input.ip);
        return { success: true };
      }),
    ),

  pairPhilipsComplete: protectedProcedure
    .input(integrationPairCompleteSchema)
    .mutation(({ input }) =>
      handleServiceCall(async () => {
        const integration = await integrationService.pairPhilipsComplete(
          input.ip,
          input.pin,
          input.description,
        );
        return integration;
      }),
    ),
});
