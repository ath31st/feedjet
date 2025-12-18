import { integrationTypes } from '@shared/types/integration.js';
import z from 'zod';
import { kioskIdSchema } from './kiosk.schemas.js';

const integrationTypeSchema = z.enum(integrationTypes);
const integrationTextSchema = z.string().min(1).max(500);

export const integrationCreateSchema = z.object({
  kioskId: kioskIdSchema,
  data: z.object({
    type: integrationTypeSchema,
    description: integrationTextSchema.optional(),
    login: integrationTextSchema.optional(),
    password: integrationTextSchema.optional(),
  }),
});

export const integrationUpdateSchema = z
  .object({
    kioskId: kioskIdSchema,
    update: z.object({
      type: integrationTypeSchema,
      description: integrationTextSchema.optional(),
      login: integrationTextSchema.optional(),
      password: integrationTextSchema.optional(),
    }),
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: 'At least one field must be provided',
  });

export const integrationDeleteSchema = z.object({
  type: integrationTypeSchema,
});
