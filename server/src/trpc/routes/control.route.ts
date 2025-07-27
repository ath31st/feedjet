import { eventBus, t } from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';

export const controlRouter = t.router({
  reloadKiosks: protectedProcedure.mutation(() => {
    eventBus.emit('control');
    return true;
  }),
});
