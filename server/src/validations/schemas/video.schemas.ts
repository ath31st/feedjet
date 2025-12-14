import z from 'zod';
import { batchUpdateImageOrderSchema } from './image.schemas.js';
import { kioskIdSchema } from './kiosk.schemas.js';

export const updateVideoMetadataSchema = z.object({
  kioskId: kioskIdSchema,
  filename: z.string(),
  isActive: z.boolean(),
});

export const batchUpdateVideoOrderSchema = batchUpdateImageOrderSchema;
