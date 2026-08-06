import { z } from 'zod';

import { scenarioWidgetTypes } from '@shared/types/scenario.js';
import { kioskIdSchema } from './kiosk.schemas.js';

const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

function refineShowPeriod(
  value: { activeFrom?: string | null; activeTo?: string | null },
  ctx: z.RefinementCtx,
) {
  const from = value.activeFrom ?? null;
  const to = value.activeTo ?? null;
  const hasFrom = from != null;
  const hasTo = to != null;

  if (hasFrom !== hasTo) {
    ctx.addIssue({
      code: 'custom',
      message: 'activeFrom and activeTo must both be set or both be null',
      path: hasFrom ? ['activeTo'] : ['activeFrom'],
    });
    return;
  }

  if (hasFrom && hasTo && from > to) {
    ctx.addIssue({
      code: 'custom',
      message: 'activeFrom must be less than or equal to activeTo',
      path: ['activeFrom'],
    });
  }
}

const baseScenarioItemSchema = z.object({
  order: z.number().default(0),
  isActive: z.boolean().default(true),
  durationSeconds: z.number().optional(),
  activeFrom: dateStringSchema.nullable().optional(),
  activeTo: dateStringSchema.nullable().optional(),
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

export const scenarioItemSchema = z
  .discriminatedUnion('type', [
    widgetScenarioItemSchema,
    imageScenarioItemSchema,
    videoScenarioItemSchema,
    pdfScenarioItemSchema,
  ])
  .superRefine(refineShowPeriod);

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
  patch: z
    .object({
      isActive: z.boolean().optional(),
      durationSeconds: z.number().optional(),
      order: z.number().optional(),
      activeFrom: dateStringSchema.nullable().optional(),
      activeTo: dateStringSchema.nullable().optional(),
    })
    .superRefine(refineShowPeriod),
});

export const reorderScenarioItemsSchema = z.object({
  kioskId: kioskIdSchema,
  orderedIds: z.array(z.number()),
});

export const deleteScenarioItemSchema = z.object({
  kioskId: kioskIdSchema,
  itemId: z.number(),
});

const replaceScenarioItemSchema = z
  .discriminatedUnion('type', [
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
  ])
  .superRefine(refineShowPeriod);

export const replaceScenarioItemsSchema = z.object({
  kioskId: kioskIdSchema,
  items: z.array(replaceScenarioItemSchema),
});

export type ScenarioItemInput = z.infer<typeof scenarioItemSchema>;
export type ReplaceScenarioItemInput = z.infer<
  typeof replaceScenarioItemSchema
>;
