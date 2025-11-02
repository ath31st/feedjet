import {
  t,
  publicProcedure,
  eventBus,
  birthdayFileService,
  birthdayService,
} from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';
import {
  birthdayCreateSchema,
  birthdayIdInputSchema,
} from '../../validations/schemas/birthday.schemas.js';
import { fileParamsSchema } from '../../validations/schemas/file.storage.validation.js';

export const birthdayRouter = t.router({
  uploadFile: protectedProcedure
    .input(fileParamsSchema)
    .mutation(async ({ input }) => {
      const file = input.get('file') as File;
      const filename = input.get('filename') as string;

      const birthdays = await birthdayFileService.handleUpload(file, filename);

      return { ok: true, birthdays };
    }),

  birthdays: publicProcedure.query(() => {
    const birthdays = birthdayService.getAll();
    return birthdays;
  }),

  create: protectedProcedure
    .input(birthdayCreateSchema)
    .mutation(({ input }) => {
      const birthday = birthdayService.create(input);
      const birthdays = birthdayService.getAll();

      eventBus.emit('birthday', birthdays);

      return { ok: true, birthday };
    }),

  delete: protectedProcedure
    .input(birthdayIdInputSchema)
    .mutation(async ({ input }) => {
      const result = birthdayService.delete(input.id);
      const birthdays = birthdayService.getAll();

      eventBus.emit('birthday', birthdays);

      return { ok: result === 1 };
    }),
});
