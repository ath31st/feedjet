import z from 'zod';

export const updateVideoMetadataSchema = z.object({
  filename: z.string(),
  isActive: z.boolean(),
});
