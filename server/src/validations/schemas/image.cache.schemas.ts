import z from 'zod';

export const imageCacheParamsSchema = z.object({
  url: z.url(),
  w: z.number().int().positive().optional(),
});
