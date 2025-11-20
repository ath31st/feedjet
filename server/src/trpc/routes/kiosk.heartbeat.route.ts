import { t, kioskHeartbeatService, publicProcedure } from '../../container.js';
import { handleServiceCall } from '../error.handler.js';
import {
  kioskIdInputSchema,
  kioskSlugInputSchema,
} from '../../validations/schemas/kiosk.schemas.js';
import { protectedProcedure } from '../../middleware/auth.js';
import z from 'zod';

export const kioskHeartbeatRouter = t.router({
  heartbeat: publicProcedure
    .input(kioskSlugInputSchema.and(kioskIdInputSchema))
    .mutation(({ input, ctx }) =>
      handleServiceCall(() => {
        return kioskHeartbeatService.registerHeartbeat(
          input.kioskId,
          input.slug,
          ctx.req.socket.remoteAddress as string,
        );
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
