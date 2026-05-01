import z from 'zod';
import { tickerDirections } from '@shared/types/ticker.config.js';
import { kioskIdSchema } from './kiosk.schemas.js';

const tickerDirectionSchema = z.enum(tickerDirections);

export const tickerConfigCreateSchema = z.object({
  text: z.string().min(1).max(500),
  isActive: z.boolean().optional(),
  speedPxPerSec: z.number().int().positive().optional(),
  direction: tickerDirectionSchema,
  fontScale: z.number().int().min(10).max(300).optional(),
  textColor: z.string().min(1).max(50).optional(),
  backgroundColor: z.string().min(1).max(50).optional(),
  backgroundOpacity: z.number().int().min(0).max(100).optional(),
  height: z.number().int().positive().optional(),
  positionY: z.number().int().min(0).max(2000).optional(),
  paddingX: z.number().int().min(0).max(200).optional(),
  isLooped: z.boolean().optional(),
});

export const tickerConfigUpsertSchema = z.object({
  kioskId: kioskIdSchema,
  text: z.string().min(1).max(500),
  isActive: z.boolean(),
  speedPxPerSec: z.number().int().positive(),
  direction: tickerDirectionSchema,
  fontScale: z.number().int().min(10).max(300),
  textColor: z.string().min(1).max(50),
  backgroundColor: z.string().min(1).max(50),
  backgroundOpacity: z.number().int().min(0).max(100),
  height: z.number().int().positive(),
  positionY: z.number().int().min(0).max(2000),
  paddingX: z.number().int().min(0).max(200),
  isLooped: z.boolean(),
});

export const tickerConfigUpdateSchema = z
  .object({
    text: z.string().min(1).max(500).optional(),
    isActive: z.boolean().optional(),
    speedPxPerSec: z.number().int().positive().optional(),
    direction: tickerDirectionSchema.optional(),
    fontScale: z.number().int().min(10).max(300).optional(),
    textColor: z.string().min(1).max(50).optional(),
    backgroundColor: z.string().min(1).max(50).optional(),
    backgroundOpacity: z.number().int().min(0).max(100).optional(),
    height: z.number().int().positive().optional(),
    positionY: z.number().int().min(0).max(2000).optional(),
    paddingX: z.number().int().min(0).max(200).optional(),
    isLooped: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const tickerConfigParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const tickerConfigUpdateInputSchema = z.object({
  kioskId: kioskIdSchema,
  data: tickerConfigUpdateSchema,
});

export const tickerConfigCreateInputSchema = z.object({
  kioskId: kioskIdSchema,
  data: tickerConfigCreateSchema,
});

export const tickerConfigUpsertInputSchema = tickerConfigUpsertSchema;
