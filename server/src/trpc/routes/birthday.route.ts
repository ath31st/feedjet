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
  birthdayDateRangeInputSchema,
  birthdayIdInputSchema,
  birthdayMonthInputSchema,
  birthdayUpdateSchema,
} from '../../validations/schemas/birthday.schemas.js';
import { fileParamsSchema } from '../../validations/schemas/file.storage.validation.js';
import { handleServiceCall } from '../error.handler.js';

export const birthdayRouter = t.router({
  uploadFile: protectedProcedure
    .input(fileParamsSchema)
    .mutation(async ({ input }) => {
      const file = input.get('file') as File;
      const dateFormat = input.get('dateFormat') as string;
      const lastDays = input.get('lastDays') as unknown as number;

      const birthdays = await birthdayFileService.handleUpload(
        file,
        lastDays ? lastDays : 0,
        dateFormat ? dateFormat : undefined,
      );

      return { ok: true, birthdays };
    }),

  birthdays: protectedProcedure.query(() => {
    const birthdays = birthdayService.getAll();
    return birthdays;
  }),

  birthdaysByMonth: publicProcedure
    .input(birthdayMonthInputSchema)
    .query(({ input }) => {
      const birthdays = birthdayService.getByMonth(input.month);
      return birthdays;
    }),

  birthdaysDayMonthRange: publicProcedure
    .input(birthdayDateRangeInputSchema)
    .query(({ input }) => {
      const birthdays = birthdayService.getByDayMonthRange(
        input.startDate,
        input.endDate,
      );
      return birthdays;
    }),

  create: protectedProcedure.input(birthdayCreateSchema).mutation(({ input }) =>
    handleServiceCall(() => {
      const birthday = birthdayService.create(input);
      const birthdays = birthdayService.getAll();

      eventBus.emit('birthday', birthdays);

      return { ok: true, birthday };
    }),
  ),

  update: protectedProcedure.input(birthdayUpdateSchema).mutation(({ input }) =>
    handleServiceCall(() => {
      const birthday = birthdayService.update(input.id, {
        fullName: input.fullName,
        department: input.department,
        birthDate: input.birthDate,
      });
      const birthdays = birthdayService.getAll();

      eventBus.emit('birthday', birthdays);

      return { ok: true, birthday };
    }),
  ),

  delete: protectedProcedure
    .input(birthdayIdInputSchema)
    .mutation(async ({ input }) =>
      handleServiceCall(() => {
        const result = birthdayService.delete(input.id);
        const birthdays = birthdayService.getAll();

        eventBus.emit('birthday', birthdays);

        return { ok: result === 1 };
      }),
    ),
});
