import {
  t,
  publicProcedure,
  birthdayWidgetTransformService,
} from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';
import { birthdayMonthInputSchema } from '../../validations/schemas/birthday.schemas.js';
import { birthdayWidgetTransformInputSchema } from '../../validations/schemas/birthday.widget.transform.schemas.js';

export const birthdayWidgetTransformRouter = t.router({
  upsert: protectedProcedure
    .input(birthdayWidgetTransformInputSchema.and(birthdayMonthInputSchema))
    .mutation(async ({ input }) => {
      const bwt = birthdayWidgetTransformService.upsert(input);
      return { ok: true, bwt };
    }),

  getByMonth: publicProcedure
    .input(birthdayMonthInputSchema)
    .query(({ input }) => {
      const bwt = birthdayWidgetTransformService.getByMonth(input.month);
      return bwt;
    }),

  getDefault: protectedProcedure.query(() => {
    const bwt = birthdayWidgetTransformService.getDefault();
    return bwt;
  }),
});
