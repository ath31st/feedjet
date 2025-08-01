import z from 'zod';

export const feedConfigParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const feedConfigUpdateSchema = z
  .object({
    cellsPerPage: z.number().int().min(1).max(10).optional(),
    pagesCount: z.number().int().min(1).max(10).optional(),
    carouselIntervalMs: z.number().int().min(10_000).max(3_600_000).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const feedConfigResponseSchema = z.object({
  id: z.number(),
  cellsPerPage: z.number().int(),
  pagesCount: z.number().int(),
  carouselIntervalMs: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
