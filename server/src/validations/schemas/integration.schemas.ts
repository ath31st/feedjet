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

export const integrationUpdateSchema = z.object({
  kioskId: kioskIdSchema,
  update: z.object({
    type: integrationTypeSchema,
    description: integrationTextSchema.optional(),
    login: integrationTextSchema.optional(),
    password: integrationTextSchema.optional(),
  }),
});

const ipSchema = z
  .string()
  .min(7)
  .max(45)
  .regex(/^[0-9a-fA-F.:]+$/, 'Invalid IP address');

const pinSchema = z
  .string()
  .min(1)
  .max(16)
  .regex(/^[0-9]+$/, 'PIN must contain only digits');

export const integrationPairStartSchema = z.object({
  kioskId: kioskIdSchema,
  ip: ipSchema,
});

export const integrationPairCompleteSchema = z.object({
  kioskId: kioskIdSchema,
  pin: pinSchema,
  description: integrationTextSchema.optional(),
});
