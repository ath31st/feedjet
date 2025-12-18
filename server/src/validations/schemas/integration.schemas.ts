import { integrationTypes } from '@shared/types/integration.js';
import z from 'zod';

const integrationTypeSchema = z.enum(integrationTypes);

export const integrationCreateSchema = z.object({
  type: integrationTypeSchema,
  url: z.url().optional(),
  login: z.string().min(1).max(500).optional(),
  password: z.string().min(1).max(500),
});

export const integrationUpdateSchema = z
  .object({
    type: integrationTypeSchema,
    url: z.url().optional(),
    login: z.string().min(1).max(500).optional(),
    password: z.string().min(1).max(500).optional(),
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: 'At least one field must be provided',
  });

export const integrationDeleteSchema = z.object({
  type: integrationTypeSchema,
});
