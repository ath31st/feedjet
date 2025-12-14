import { z } from 'zod';

export const kioskIdSchema = z.number().int().positive().max(999999);
const kioskSlugSchema = z
  .string()
  .min(1)
  .max(50)
  .regex(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers and hyphens',
  });

const kioskNameSchema = z
  .string()
  .min(1)
  .max(10)
  .regex(/^[a-z0-9-]+$/, {
    message: 'Name can only contain lowercase letters, numbers and hyphens',
  });

export const newKioskSchema = z.object({
  name: kioskNameSchema,
  slug: kioskSlugSchema,
  description: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
});

const updateKioskSchema = z
  .object({
    name: kioskNameSchema.optional(),
    isActive: z.boolean().optional(),
    description: z.string().max(500).optional(),
    location: z.string().max(200).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const kioskIdInputSchema = z.object({ kioskId: kioskIdSchema });
export const kioskSlugInputSchema = z.object({ slug: kioskSlugSchema });
export const updateKioskInputSchema = z.object({
  kioskId: kioskIdSchema,
  data: updateKioskSchema,
});
