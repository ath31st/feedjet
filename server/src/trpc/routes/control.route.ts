import { eventBus, t } from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';
import type { ControlEvent } from '@shared/types/control.event.js';
import { kioskIdInputSchema } from '../../validations/schemas/kiosk.schemas.js';

export const controlRouter = t.router({
  reloadKiosks: protectedProcedure
    .input(kioskIdInputSchema)
    .mutation(({ input }) => {
      const event: ControlEvent = {
        type: 'reload-kiosks',
      };
      eventBus.emit(`control:${input.kioskId}`, event);
      return true;
    }),
});
