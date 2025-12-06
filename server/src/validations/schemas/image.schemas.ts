import z from 'zod';
import { kioskIdSchema } from './kiosk.schemas.js';

export const updateImageMetadataSchema = z.object({
  kioskId: kioskIdSchema,
  fileName: z.string(),
  isActive: z.boolean(),
  order: z.number().int().min(0).max(999),
});
