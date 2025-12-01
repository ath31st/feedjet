import { t, kioskHeartbeatService, publicProcedure } from '../../container.js';
import { handleServiceCall } from '../error.handler.js';
import { kioskSlugInputSchema } from '../../validations/schemas/kiosk.schemas.js';
import { protectedProcedure } from '../../middleware/auth.js';
import { extractRealIp } from '../../utils/extract.real.ip.js';

export const kioskHeartbeatRouter = t.router({
  heartbeat: publicProcedure
    .input(kioskSlugInputSchema)
    .mutation(({ input, ctx }) =>
      handleServiceCall(() => {
        const ip = extractRealIp(ctx.req);
        return kioskHeartbeatService.registerHeartbeat(input.slug, ip);
      }),
    ),

  getActiveHeartbeats: protectedProcedure.query(() => {
    return kioskHeartbeatService.getActiveKiosks();
  }),
});
