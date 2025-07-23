import { z } from 'zod';

export const userParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const userCreateSchema = z.object({
  login: z.string(),
  password: z.string(),
});

export const userUpdateSchema = z
  .object({
    login: z.string().optional(),
    password: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const userResponseSchema = z.object({
  id: z.number(),
  login: z.string(),
});
