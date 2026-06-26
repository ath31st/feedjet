import { t, deviceService, integrationService } from '../../container.js';
import { handleServiceCall } from '../error.handler.js';
import { protectedProcedure, publicProcedure } from '../../middleware/auth.js';
import { extractRealIp } from '../../utils/extract.real.ip.js';
import {
  deviceIdInputSchema,
  deviceUpsertSchema,
} from '../../validations/schemas/device.schema.js';

export const deviceRouter = t.router({
  registerDevice: publicProcedure
    .input(deviceUpsertSchema)
    .mutation(({ input, ctx }) =>
      handleServiceCall(() => {
        const ip = extractRealIp(ctx.req);
        return deviceService.upsert(ip, input.data);
      }),
    ),

  getAllDevices: protectedProcedure.query(() => {
    const integrations = integrationService.getAll();
    const integrationIps = new Set(integrations.map((i) => i.ip));

    return deviceService.getAllWithIntegration(integrationIps);
  }),

  delete: protectedProcedure
    .input(deviceIdInputSchema)
    .mutation(({ input }) => {
      return deviceService.delete(input.deviceId);
    }),
});
