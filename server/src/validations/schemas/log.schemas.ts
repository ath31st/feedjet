import { LogLevel } from '@shared/types/log.js';
import z from 'zod';

const logLevelSchema = z.union([
  z.literal(LogLevel.Trace),
  z.literal(LogLevel.Debug),
  z.literal(LogLevel.Info),
  z.literal(LogLevel.Warn),
  z.literal(LogLevel.Error),
  z.literal(LogLevel.Fatal),
]);

const logFilter = z.object({
  levels: z.array(logLevelSchema).optional(),
  source: z.string().optional(),
  search: z.string().optional(),
});

export const logInputSchema = z.object({
  file: z.string().optional(),
  filter: logFilter.optional(),
  page: z.number().int().min(0).optional(),
  pageSize: z.number().int().positive().optional(),
});

export const logFileSchema = z.object({
  file: z.string().min(1),
});

export const deleteLogFilesSchema = z.object({
  daysToKeep: z.number().int().min(1),
});
