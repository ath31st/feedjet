import z from 'zod';
import { kioskIdSchema } from './kiosk.schemas.js';

export const kioskControlInputSchema = z.object({
  kioskId: kioskIdSchema,
  kioskIp: z.string(),
});
