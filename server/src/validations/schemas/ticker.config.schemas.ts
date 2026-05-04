import z from 'zod';
import { tickerDirections } from '@shared/types/ticker.config.js';
import { kioskIdSchema } from './kiosk.schemas.js';
import { TICKER_LIMITS } from '../../config/ticker.config.js';

const tickerDirectionSchema = z.enum(tickerDirections);

export const tickerConfigCreateSchema = z.object({
  text: z.string().min(TICKER_LIMITS.text.min).max(TICKER_LIMITS.text.max),
  isActive: z.boolean().optional(),
  speedPxPerSec: z
    .number()
    .int()
    .min(TICKER_LIMITS.speedPxPerSec.min)
    .max(TICKER_LIMITS.speedPxPerSec.max)
    .optional(),
  direction: tickerDirectionSchema,
  fontScale: z
    .number()
    .int()
    .min(TICKER_LIMITS.fontScale.min)
    .max(TICKER_LIMITS.fontScale.max)
    .optional(),
  textColor: z
    .string()
    .min(TICKER_LIMITS.color.min)
    .max(TICKER_LIMITS.color.max)
    .optional(),
  backgroundColor: z
    .string()
    .min(TICKER_LIMITS.color.min)
    .max(TICKER_LIMITS.color.max)
    .optional(),
  backgroundOpacity: z
    .number()
    .int()
    .min(TICKER_LIMITS.backgroundOpacity.min)
    .max(TICKER_LIMITS.backgroundOpacity.max)
    .optional(),
  height: z
    .number()
    .int()
    .min(TICKER_LIMITS.height.min)
    .max(TICKER_LIMITS.height.max)
    .optional(),
  positionY: z
    .number()
    .int()
    .min(TICKER_LIMITS.positionY.min)
    .max(TICKER_LIMITS.positionY.max)
    .optional(),
  paddingX: z
    .number()
    .int()
    .min(TICKER_LIMITS.paddingX.min)
    .max(TICKER_LIMITS.paddingX.max)
    .optional(),
  isLooped: z.boolean().optional(),
});

export const tickerConfigUpsertSchema = z.object({
  kioskId: kioskIdSchema,
  text: z.string().min(TICKER_LIMITS.text.min).max(TICKER_LIMITS.text.max),
  isActive: z.boolean(),
  speedPxPerSec: z
    .number()
    .int()
    .min(TICKER_LIMITS.speedPxPerSec.min)
    .max(TICKER_LIMITS.speedPxPerSec.max),
  direction: tickerDirectionSchema,
  fontScale: z
    .number()
    .int()
    .min(TICKER_LIMITS.fontScale.min)
    .max(TICKER_LIMITS.fontScale.max),
  textColor: z
    .string()
    .min(TICKER_LIMITS.color.min)
    .max(TICKER_LIMITS.color.max),
  backgroundColor: z
    .string()
    .min(TICKER_LIMITS.color.min)
    .max(TICKER_LIMITS.color.max),
  backgroundOpacity: z
    .number()
    .int()
    .min(TICKER_LIMITS.backgroundOpacity.min)
    .max(TICKER_LIMITS.backgroundOpacity.max),
  height: z
    .number()
    .int()
    .min(TICKER_LIMITS.height.min)
    .max(TICKER_LIMITS.height.max),
  positionY: z
    .number()
    .int()
    .min(TICKER_LIMITS.positionY.min)
    .max(TICKER_LIMITS.positionY.max),
  paddingX: z
    .number()
    .int()
    .min(TICKER_LIMITS.paddingX.min)
    .max(TICKER_LIMITS.paddingX.max),
  isLooped: z.boolean(),
});

export const tickerConfigUpdateSchema = z
  .object({
    text: z.string().min(TICKER_LIMITS.text.min).max(TICKER_LIMITS.text.max),
    isActive: z.boolean().optional(),
    speedPxPerSec: z
      .number()
      .int()
      .min(TICKER_LIMITS.speedPxPerSec.min)
      .max(TICKER_LIMITS.speedPxPerSec.max)
      .optional(),
    direction: tickerDirectionSchema.optional(),
    fontScale: z
      .number()
      .int()
      .min(TICKER_LIMITS.fontScale.min)
      .max(TICKER_LIMITS.fontScale.max)
      .optional(),
    textColor: z
      .string()
      .min(TICKER_LIMITS.color.min)
      .max(TICKER_LIMITS.color.max)
      .optional(),
    backgroundColor: z
      .string()
      .min(TICKER_LIMITS.color.min)
      .max(TICKER_LIMITS.color.max)
      .optional(),
    backgroundOpacity: z
      .number()
      .int()
      .min(TICKER_LIMITS.backgroundOpacity.min)
      .max(TICKER_LIMITS.backgroundOpacity.max)
      .optional(),
    height: z
      .number()
      .int()
      .min(TICKER_LIMITS.height.min)
      .max(TICKER_LIMITS.height.max)
      .optional(),
    positionY: z
      .number()
      .int()
      .min(TICKER_LIMITS.positionY.min)
      .max(TICKER_LIMITS.positionY.max)
      .optional(),
    paddingX: z
      .number()
      .int()
      .min(TICKER_LIMITS.paddingX.min)
      .max(TICKER_LIMITS.paddingX.max)
      .optional(),
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
