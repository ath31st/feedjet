import { LogLevel } from '@shared/types/log.js';
import z from 'zod';

const logFilter = z.object({
  level: z.enum(LogLevel).optional(),
  source: z.string().optional(),
  search: z.string().optional(),
});

export const logInputSchema = z.object({
  file: z.string().optional(),
  filter: logFilter.optional(),
  page: z.number().int().min(0).optional(),
  pageSize: z.number().int().positive().optional(),
});
