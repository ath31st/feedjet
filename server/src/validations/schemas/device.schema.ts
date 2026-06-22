import { z } from 'zod';
import { kioskSlugSchema } from './kiosk.schemas.js';

const deviceIdSchema = z.string().min(8).max(255);
const userAgentSchema = z.string().min(1).max(1024);
const platformSchema = z.string().min(1).max(255).optional();

export const deviceUpsertSchema = z.object({
  data: z.object({
    deviceId: deviceIdSchema,
    slug: kioskSlugSchema,
    userAgent: userAgentSchema,
    platform: platformSchema,
  }),
});

export const deviceDeleteSchema = z.object({
  deviceId: deviceIdSchema,
});
