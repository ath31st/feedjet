import z from 'zod';
import { kioskIdInputSchema, kioskIdSchema } from './kiosk.schemas.js';

export const feedConfigParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const feedConfigUpdateSchema = z
  .object({
    visibleCellCount: z.number().int().min(1).max(10).optional(),
    carouselSize: z.number().int().min(1).max(60).optional(),
    carouselIntervalMs: z.number().int().min(10_000).max(3_600_000).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const feedConfigGetInputSchema = kioskIdInputSchema;
export const feedConfigUpdateInputSchema = z.object({
  kioskId: kioskIdSchema,
  data: feedConfigUpdateSchema,
});
