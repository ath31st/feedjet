import z from 'zod';
import { parse, isValid } from 'date-fns';

export const birthdayIdInputSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const birthdayMonthInputSchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
});

export const dateFormatSchema = z
  .string()
  .min(1)
  .max(300)
  .optional()
  .refine(
    (format) => {
      if (!format) return true;
      try {
        const testDate = parse('2000-01-01', format, new Date());
        return isValid(testDate);
      } catch {
        return false;
      }
    },
    {
      message: 'Invalid date format',
    },
  );

export const birthdayCreateSchema = z.object({
  fullName: z.string().min(1).max(300),
  department: z.string().max(300).optional(),
  birthDate: z.coerce.date(),
});
