import { eventBus, kioskControlService, t } from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';
import type { ControlEvent } from '@shared/types/control.event.js';
import { kioskIdInputSchema } from '../../validations/schemas/kiosk.schemas.js';
import { deviceControlInputSchema } from '../../validations/schemas/device.control.schemas.js';

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
    .input(deviceControlInputSchema)
    .mutation(async ({ input }) => {
      await kioskControlService.screenOn(input.ip);
      return true;
    }),

  screenOff: protectedProcedure
    .input(deviceControlInputSchema)
    .mutation(async ({ input }) => {
      await kioskControlService.screenOff(input.ip);
      return true;
    }),
});
