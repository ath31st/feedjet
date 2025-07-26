import z from 'zod';
import { allowedThemes } from '../../utils/constants/allowed.themes.js';

export const kioskConfigParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const kioskConfigCreateSchema = z.object({
  url: z.string(),
});

export const kioskConfigUpdateSchema = z
  .object({
    cellsPerPage: z.number().int().min(1).max(10).optional(),
    theme: z.enum(allowedThemes).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const kioskConfigResponseSchema = z.object({
  id: z.number(),
  cellsPerPagerl: z.number(),
  theme: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
