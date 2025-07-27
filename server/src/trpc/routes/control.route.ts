import { eventBus, t } from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';
import { switchWidgetSchema } from '../../validations/schemas/control.schemas.js';

export const controlRouter = t.router({
  reloadKiosks: protectedProcedure.mutation(() => {
    eventBus.emit('control');
    return true;
  }),

  switchWidget: protectedProcedure
    .input(switchWidgetSchema)
    .mutation(({ input }) => {
      eventBus.emit('switch-widget', input);
      return true;
    }),
});
