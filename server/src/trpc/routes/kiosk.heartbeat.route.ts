import { t, kioskHeartbeatService, publicProcedure } from '../../container.js';
import { handleServiceCall } from '../error.handler.js';
import { kioskSlugInputSchema } from '../../validations/schemas/kiosk.schemas.js';
import { protectedProcedure } from '../../middleware/auth.js';
import z from 'zod';
import { normalizeIp } from '../../utils/normalizeIp.js';

export const kioskHeartbeatRouter = t.router({
  heartbeat: publicProcedure
    .input(kioskSlugInputSchema)
    .mutation(({ input, ctx }) =>
      handleServiceCall(() => {
        const ip = normalizeIp(ctx.req.socket.remoteAddress);
        return kioskHeartbeatService.registerHeartbeat(input.slug, ip);
      }),
    ),

  getActiveHeartbeats: protectedProcedure
    .input(z.object({ timeoutMs: z.number().int().positive() }))
    .query(({ input }) => {
      handleServiceCall(() => {
        return kioskHeartbeatService.getActiveKiosks(input.timeoutMs);
      });
    }),
});
