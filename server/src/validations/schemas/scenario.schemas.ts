import { z } from 'zod';

import { scenarioWidgetTypes } from '@shared/types/scenario.js';

const baseScenarioItemSchema = z.object({
  order: z.number().default(0),
  isActive: z.boolean().default(true),
  durationSeconds: z.number().optional(),
});

export const widgetScenarioItemSchema = baseScenarioItemSchema.extend({
  type: z.literal('widget'),
  widgetType: z.enum(scenarioWidgetTypes),
  imageId: z.undefined().optional(),
  videoId: z.undefined().optional(),
});

export const imageScenarioItemSchema = baseScenarioItemSchema.extend({
  type: z.literal('image'),
  imageId: z.number(),
  widgetType: z.undefined().optional(),
  videoId: z.undefined().optional(),
});

export const videoScenarioItemSchema = baseScenarioItemSchema.extend({
  type: z.literal('video'),
  videoId: z.number(),
  widgetType: z.undefined().optional(),
  imageId: z.undefined().optional(),
});

export const scenarioItemSchema = z.discriminatedUnion('type', [
  widgetScenarioItemSchema,
  imageScenarioItemSchema,
  videoScenarioItemSchema,
]);

export const getScenarioByKioskSchema = z.object({
  kioskId: z.number(),
});

export const addScenarioItemSchema = z.object({
  kioskId: z.number(),

  item: scenarioItemSchema,
});

export const updateScenarioItemSchema = z.object({
  kioskId: z.number(),
  itemId: z.number(),
  patch: z.object({
    isActive: z.boolean().optional(),
    durationSeconds: z.number().optional(),
    order: z.number().optional(),
  }),
});

export const reorderScenarioItemsSchema = z.object({
  kioskId: z.number(),
  orderedIds: z.array(z.number()),
});

export const deleteScenarioItemSchema = z.object({
  kioskId: z.number(),
  itemId: z.number(),
});

export type ScenarioItemInput = z.infer<typeof scenarioItemSchema>;
