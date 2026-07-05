import z from 'zod';

const organizationNameSchema = z.string().min(1).max(50);
const scheduleHeaderTitleSchema = z.string().min(1).max(50);
const brandingConfigIdSchema = z.number().int().positive().max(999999);

export const newBrandingConfigSchema = z.object({
  organizationName: organizationNameSchema,
  scheduleHeaderTitle: scheduleHeaderTitleSchema,
});

export const updateBrandingConfigSchema = z
  .object({
    organizationName: organizationNameSchema.optional(),
    scheduleHeaderTitle: scheduleHeaderTitleSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update',
  });

export const brandingConfigGetInputSchema = z.object({
  brandingConfigId: brandingConfigIdSchema,
});

export const brandingConfigUpdateInputSchema = z.object({
  brandingConfigId: brandingConfigIdSchema,
  data: updateBrandingConfigSchema,
});
