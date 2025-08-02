import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const scheduleEventCreateSchema = z.object({
  date: z.string().regex(dateRegex, 'Invalid date format (YYYY-MM-DD)'),
  startTime: z.string().regex(timeRegex, 'Invalid time format (HH:mm)'),
  endTime: z
    .string()
    .regex(timeRegex, 'Invalid time format (HH:mm)')
    .optional(),
  title: z.string().min(1),
  description: z.string().optional(),
});

export const scheduleEventFindByDateRangeSchema = z.object({
  startDate: z.string().regex(dateRegex, 'Invalid date format (YYYY-MM-DD)'),
  endDate: z.string().regex(dateRegex, 'Invalid date format (YYYY-MM-DD)'),
});

export const scheduleEventFindByDateSchema = z.object({
  date: z.string().regex(dateRegex, 'Invalid date format (YYYY-MM-DD)'),
});

export const scheduleEventUpdateSchema = scheduleEventCreateSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const scheduleEventResponseSchema = z.object({
  id: z.number().int().positive(),
  date: z.string().regex(dateRegex),
  startTime: z.string().regex(timeRegex),
  endTime: z.string().regex(timeRegex).optional(),
  title: z.string(),
  description: z.string().optional(),
});

export const scheduleEventParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});
