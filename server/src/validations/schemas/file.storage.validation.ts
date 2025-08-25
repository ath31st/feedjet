import z from 'zod';

export const fileParamsSchema = z.instanceof(FormData);
export const fileDeleteParamsSchema = z.object({
  filename: z.string(),
});
