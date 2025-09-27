import z from 'zod';

export const kioskIdSchema = z.number().int().min(1);
export const kioskIdInputSchema = z.object({ kioskId: kioskIdSchema });
