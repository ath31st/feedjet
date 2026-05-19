import z from 'zod';
import {
  animationTypes,
  seasonOverlayModes,
  themes,
  widgetTypes,
} from '@shared/types/ui.config.js';
import { kioskIdInputSchema, kioskIdSchema } from './kiosk.schemas.js';

const widgetTypeSchema = z.enum(widgetTypes);
export type WidgetTypeSchema = z.infer<typeof widgetTypeSchema>;

const themeSchema = z.enum(themes);
export type ThemeSchema = z.infer<typeof themeSchema>;

const screenRotationSchema = z.union([
  z.literal(-180),
  z.literal(-90),
  z.literal(0),
  z.literal(90),
  z.literal(180),
]);
const animationModeSchema = z.enum(animationTypes);
const seasonOverlaySchema = z.enum(seasonOverlayModes);

export const uiConfigSchema = z.object({
  theme: themeSchema,
  rotatingWidgets: z
    .array(widgetTypeSchema)
    .min(1, 'At least one widget must be included in rotation'),
  autoSwitchIntervalMs: z.number().int().nonnegative(),
  screenRotation: screenRotationSchema,
  animationMode: animationModeSchema,
  seasonOverlay: seasonOverlaySchema,
});

export const uiConfigUpdateSchema = z
  .object({
    theme: themeSchema.optional(),
    rotatingWidgets: z.array(widgetTypeSchema).min(1).optional(),
    autoSwitchIntervalMs: z.number().int().nonnegative().optional(),
    screenRotation: screenRotationSchema.optional(),
    animationMode: animationModeSchema.optional(),
    seasonOverlay: seasonOverlaySchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update',
  });

export const uiConfigGetInputSchema = kioskIdInputSchema;
export const uiConfigUpdateInputSchema = z.object({
  kioskId: kioskIdSchema,
  data: uiConfigUpdateSchema,
});
