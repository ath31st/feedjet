import z from 'zod';
import { eventBus, t } from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';

export const controlRouter = t.router({
  reloadKiosks: protectedProcedure.mutation(() => {
    eventBus.emit('control');
    return true;
  }),

  switchWidget: protectedProcedure.input(z.string()).mutation((opts) => {
    eventBus.emit('switch-widget', opts.input);
    return true;
  }),
});
