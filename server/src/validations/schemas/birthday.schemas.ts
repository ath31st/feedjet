import z from 'zod';

export const birthdayIdInputSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const birthdayCreateSchema = z.object({
  fullName: z.string().min(1).max(300),
  department: z.string().max(300).optional(),
  birthDate: z.string().min(1).max(300),
});
