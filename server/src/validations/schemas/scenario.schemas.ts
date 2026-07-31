import { z } from 'zod';

import { scenarioWidgetTypes } from '@shared/types/scenario.js';
import { kioskIdSchema } from './kiosk.schemas.js';

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
  pdfId: z.undefined().optional(),
});

export const imageScenarioItemSchema = baseScenarioItemSchema.extend({
  type: z.literal('image'),
  imageId: z.number(),
  widgetType: z.undefined().optional(),
  videoId: z.undefined().optional(),
  pdfId: z.undefined().optional(),
});

export const videoScenarioItemSchema = baseScenarioItemSchema.extend({
  type: z.literal('video'),
  videoId: z.number(),
  widgetType: z.undefined().optional(),
  imageId: z.undefined().optional(),
  pdfId: z.undefined().optional(),
});

export const pdfScenarioItemSchema = baseScenarioItemSchema.extend({
  type: z.literal('pdf'),
  pdfId: z.number(),
  widgetType: z.undefined().optional(),
  imageId: z.undefined().optional(),
  videoId: z.undefined().optional(),
});

export const scenarioItemSchema = z.discriminatedUnion('type', [
  widgetScenarioItemSchema,
  imageScenarioItemSchema,
  videoScenarioItemSchema,
  pdfScenarioItemSchema,
]);

export const getScenarioByKioskSchema = z.object({
  kioskId: kioskIdSchema,
});

export const addScenarioItemSchema = z.object({
  kioskId: kioskIdSchema,

  item: scenarioItemSchema,
});

export const addScenarioItemsSchema = z.object({
  kioskId: kioskIdSchema,

  items: z.array(scenarioItemSchema),
});

export const updateScenarioItemSchema = z.object({
  kioskId: kioskIdSchema,
  itemId: z.number(),
  patch: z.object({
    isActive: z.boolean().optional(),
    durationSeconds: z.number().optional(),
    order: z.number().optional(),
  }),
});

export const reorderScenarioItemsSchema = z.object({
  kioskId: kioskIdSchema,
  orderedIds: z.array(z.number()),
});

export const deleteScenarioItemSchema = z.object({
  kioskId: kioskIdSchema,
  itemId: z.number(),
});

const replaceScenarioItemSchema = z.discriminatedUnion('type', [
  widgetScenarioItemSchema.extend({
    id: z.number().int().positive().optional(),
  }),
  imageScenarioItemSchema.extend({
    id: z.number().int().positive().optional(),
  }),
  videoScenarioItemSchema.extend({
    id: z.number().int().positive().optional(),
  }),
  pdfScenarioItemSchema.extend({
    id: z.number().int().positive().optional(),
  }),
]);

export const replaceScenarioItemsSchema = z.object({
  kioskId: kioskIdSchema,
  items: z.array(replaceScenarioItemSchema),
});

export type ScenarioItemInput = z.infer<typeof scenarioItemSchema>;
export type ReplaceScenarioItemInput = z.infer<
  typeof replaceScenarioItemSchema
>;
