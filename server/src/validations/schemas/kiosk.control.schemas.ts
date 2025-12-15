import z from 'zod';

export const kioskControlInputSchema = z.object({
  kioskIp: z.string(),
  password: z.string(),
});
