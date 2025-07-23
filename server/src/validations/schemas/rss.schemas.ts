import { z } from 'zod';

export const rssParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const rssCreateSchema = z.object({
  url: z.string(),
});

export const rssUpdateSchema = z
  .object({
    url: z.string().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const rssResponseSchema = z.object({
  id: z.number(),
  url: z.string(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
