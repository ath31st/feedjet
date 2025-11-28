import z from 'zod';

export const updateImageMetadataSchema = z.object({
  filename: z.string(),
  isActive: z.boolean(),
});
