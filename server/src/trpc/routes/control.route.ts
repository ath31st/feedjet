import { eventBus, deviceControlService, t } from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';
import type { ControlEvent } from '@shared/types/control.event.js';
import { deviceControlInputSchema } from '../../validations/schemas/device.control.schemas.js';
import { integrationIpInputSchema } from '../../validations/schemas/integration.schemas.js';

export const controlRouter = t.router({
  reloadDevice: protectedProcedure
    .input(integrationIpInputSchema)
    .mutation(({ input }) => {
      const event: ControlEvent = {
        command: 'reload-device',
        targetIp: input.ip,
      };
      eventBus.emit('control', event);
      return true;
    }),

  screenOn: protectedProcedure
    .input(deviceControlInputSchema)
    .mutation(async ({ input }) => {
      await deviceControlService.screenOn(input.ip);
      return true;
    }),

  screenOff: protectedProcedure
    .input(deviceControlInputSchema)
    .mutation(async ({ input }) => {
      await deviceControlService.screenOff(input.ip);
      return true;
    }),
});
