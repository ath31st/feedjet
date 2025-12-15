import { eventBus, fullyKioskClient, t } from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';
import type { ControlEvent } from '@shared/types/control.event.js';
import { kioskIdInputSchema } from '../../validations/schemas/kiosk.schemas.js';
import { kioskControlInputSchema } from '../../validations/schemas/kiosk.control.schemas.js';

export const controlRouter = t.router({
  reloadKiosks: protectedProcedure
    .input(kioskIdInputSchema)
    .mutation(({ input }) => {
      const event: ControlEvent = {
        type: 'reload-kiosk',
      };
      eventBus.emit(`control:${input.kioskId}`, event);
      return true;
    }),

  screenOn: protectedProcedure
    .input(kioskControlInputSchema)
    .mutation(async ({ input }) => {
      const target = {
        ip: input.kioskIp,
        password: input.password,
      };
      await fullyKioskClient.screenOn(target);
      return true;
    }),

  screenOff: protectedProcedure
    .input(kioskControlInputSchema)
    .mutation(async ({ input }) => {
      const target = {
        ip: input.kioskIp,
        password: input.password,
      };
      await fullyKioskClient.screenOff(target);
      return true;
    }),
});
