import z from 'zod';

export const deviceControlInputSchema = z.object({
  ip: z.ipv4(),
});
