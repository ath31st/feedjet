import z from 'zod';

export const feedConfigParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const feedConfigUpdateSchema = z
  .object({
    cellsPerPage: z.number().int().min(1).max(10).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const feedConfigResponseSchema = z.object({
  id: z.number(),
  cellsPerPagerl: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
