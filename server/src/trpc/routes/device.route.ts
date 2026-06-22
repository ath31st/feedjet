import { t, deviceService } from '../../container.js';
import { handleServiceCall } from '../error.handler.js';
import { protectedProcedure, publicProcedure } from '../../middleware/auth.js';
import { extractRealIp } from '../../utils/extract.real.ip.js';
import {
  deviceDeleteSchema,
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
    return deviceService.getAll();
  }),

  delete: protectedProcedure.input(deviceDeleteSchema).mutation(({ input }) => {
    return deviceService.delete(input.deviceId);
  }),
});
