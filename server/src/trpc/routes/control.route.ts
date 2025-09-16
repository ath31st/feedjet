import { eventBus, t } from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';
import type { ControlEvent } from '@shared/types/control.event.js';

export const controlRouter = t.router({
  reloadKiosks: protectedProcedure.mutation(() => {
    const event: ControlEvent = {
      type: 'reload-kiosks',
    };
    eventBus.emit('control', event);
    return true;
  }),
});
