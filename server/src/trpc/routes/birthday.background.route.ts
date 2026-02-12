import { t, birthdayBackgroundService } from '../../container.js';
import { publicProcedure, protectedProcedure } from '../../middleware/auth.js';
import { birthdayMonthInputSchema } from '../../validations/schemas/birthday.schemas.js';

import { fileParamsSchema } from '../../validations/schemas/file.storage.validation.js';

export const birthdayBackgroundRouter = t.router({
  getByMonth: publicProcedure
    .input(birthdayMonthInputSchema)
    .query(async ({ input }) => {
      const background = await birthdayBackgroundService.getBackgroundByMonth(
        input.month,
      );
      return background;
    }),

  uploadBackground: protectedProcedure
    .input(fileParamsSchema)
    .mutation(async ({ input }) => {
      const file = input.get('file') as File;
      const month = input.get('month') as unknown as number;

      const path = await birthdayBackgroundService.uploadBackgroundByMonth(
        month,
        file,
      );

      return { ok: true, path };
    }),

  backgrounds: protectedProcedure.query(async () => {
    const backgrounds = await birthdayBackgroundService.listBackgrounds();
    return backgrounds;
  }),

  delete: protectedProcedure
    .input(birthdayMonthInputSchema)
    .mutation(async ({ input }) => {
      await birthdayBackgroundService.removeBackgroundByMonth(input.month);
    }),
});
