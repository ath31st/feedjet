import z from 'zod';
import { kioskIdSchema } from './kiosk.schemas.js';
import type { DayOfWeek } from '@shared/types/kiosk.work.schedule.js';

export const dayOfWeekSchema = z
  .number()
  .int()
  .min(0)
  .max(6)
  .transform((val) => val as DayOfWeek);

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
