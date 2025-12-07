import z from 'zod';
import { kioskIdSchema } from './kiosk.schemas.js';

export const updateIsActiveImageSchema = z.object({
  kioskId: kioskIdSchema,
  fileName: z.string(),
  isActive: z.boolean(),
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
