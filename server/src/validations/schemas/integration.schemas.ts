import { integrationTypes } from '@shared/types/integration.js';
import z from 'zod';
import { kioskIdSchema } from './kiosk.schemas.js';

const integrationTypeSchema = z.enum(integrationTypes);

export const integrationCreateSchema = z.object({
  kioskId: kioskIdSchema,
  data: z.object({
    type: integrationTypeSchema,
    url: z.url().optional(),
    login: z.string().min(1).max(500).optional(),
    password: z.string().min(1).max(500),
  }),
});

export const integrationUpdateSchema = z
  .object({
    kioskId: kioskIdSchema,
    update: z.object({
      type: integrationTypeSchema,
      url: z.url().optional(),
      login: z.string().min(1).max(500).optional(),
      password: z.string().min(1).max(500),
    }),
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: 'At least one field must be provided',
  });

export const integrationDeleteSchema = z.object({
  type: integrationTypeSchema,
});
