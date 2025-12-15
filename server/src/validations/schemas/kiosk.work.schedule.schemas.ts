import z from 'zod';
import { kioskIdSchema } from './kiosk.schemas.js';

export const dayOfWeekSchema = z
  .enum(['0', '1', '2', '3', '4', '5', '6'])
  .transform((val) => Number(val) as 0 | 1 | 2 | 3 | 4 | 5 | 6);
export type DayOfWeekSchema = z.infer<typeof dayOfWeekSchema>;

export const kioskWorkScheduleUpsertInputSchema = z.object({
  kioskId: kioskIdSchema,
  data: z.object({
    dayOfWeek: dayOfWeekSchema,
    isEnabled: z.boolean(),
    startTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, 'Start time must be in HH:MM format'),
    endTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, 'End time must be in HH:MM format'),
  }),
});
