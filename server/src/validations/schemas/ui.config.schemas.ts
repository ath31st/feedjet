import z from 'zod';
import { themes, widgetTypes } from '@shared/types/ui.config.js';

const widgetTypeSchema = z.enum(widgetTypes);
export type WidgetTypeSchema = z.infer<typeof widgetTypeSchema>;

const themeSchema = z.enum(themes);
export type ThemeSchema = z.infer<typeof themeSchema>;

export const uiConfigSchema = z.object({
  theme: themeSchema,
  rotatingWidgets: z
    .array(widgetTypeSchema)
    .min(1, 'At least one widget must be included in rotation'),
  autoSwitchIntervalMs: z.number().int().nonnegative(),
});

export const uiConfigUpdateSchema = z
  .object({
    theme: themeSchema.optional(),
    rotatingWidgets: z.array(widgetTypeSchema).min(1).optional(),
    autoSwitchIntervalMs: z.number().int().nonnegative().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update',
  });
