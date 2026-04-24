import z from 'zod';
import { kioskIdSchema } from './kiosk.schemas.js';

export const updateKioskImageSchema = z.object({
  kioskId: kioskIdSchema,
  fileName: z.string(),
  isActive: z.boolean(),
  durationSeconds: z.number().int().min(0).max(10_000),
});

export const batchUpdateImageOrderSchema = z.object({
  kioskId: kioskIdSchema,
  updates: z.array(
    z.object({
      order: z.number().int().min(0).max(999),
      fileName: z.string(),
    }),
  ),
});

export const batchUpdateImageDurationSchema = z.object({
  kioskId: kioskIdSchema,
  updates: z.array(
    z.object({
      durationSeconds: z.number().int().min(0).max(10_000),
      fileName: z.string(),
    }),
  ),
});
