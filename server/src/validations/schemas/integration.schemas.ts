import { z } from 'zod';

const hostSchema = z.string().min(1).max(255);
const portSchema = z.number().int().min(1).max(65535);

const fullyKioskConfigSchema = z.object({
  login: z.string().min(1).max(255),
  password: z.string().min(1).max(255),
});

const adbConfigSchema = z.object({
  port: z.number().int().min(1).max(65535).optional(),
});

const philipsJointspaceConfigSchema = z.object({
  deviceId: z.string().min(1),
  authKey: z.string().min(1),
});

const otherConfigSchema = z.record(z.string(), z.unknown());

const baseIntegrationSchema = z.object({
  host: hostSchema,
  port: portSchema,
  description: z.string().max(500).optional(),
});

const integrationDataSchema = z
  .discriminatedUnion('type', [
    z.object({
      type: z.literal('fully_kiosk'),
      ...baseIntegrationSchema.shape,
      config: fullyKioskConfigSchema,
    }),

    z.object({
      type: z.literal('adb'),
      ...baseIntegrationSchema.shape,
      config: adbConfigSchema,
    }),

    z.object({
      type: z.literal('philips_jointspace'),
      ...baseIntegrationSchema.shape,
      config: philipsJointspaceConfigSchema,
    }),

    z.object({
      type: z.literal('other'),
      ...baseIntegrationSchema.shape,
      config: otherConfigSchema,
    }),
  ])
  .superRefine((data, ctx) => {
    if (data.type === 'philips_jointspace') {
      ctx.addIssue({
        code: 'custom',
        message: 'Philips JointSpace must be created via pairing',
        path: ['type'],
      });
    }
  });

export const integrationCreateSchema = z.object({
  data: integrationDataSchema,
});

export const integrationUpdateSchema = z.object({
  data: z
    .object({
      id: z.number().int().positive(),
      host: hostSchema.optional(),
      port: portSchema.optional(),
      description: z.string().max(500).optional(),
      config: z
        .union([
          fullyKioskConfigSchema,
          adbConfigSchema,
          philipsJointspaceConfigSchema,
          otherConfigSchema,
        ])
        .optional(),
    })
    .refine(
      (data) =>
        data.host !== undefined ||
        data.port !== undefined ||
        data.description !== undefined ||
        data.config !== undefined,
      {
        message: 'At least one field must be provided for update',
      },
    ),
});

export const integrationPairStartSchema = z.object({
  ip: z.ipv4(),
});

export const integrationPairCompleteSchema = z.object({
  integrationId: z.number().int().positive(),
  ip: z.ipv4(),
  pin: z.string().min(1).max(20),
  description: z.string().max(500).optional(),
});

export const integrationIdInputSchema = z.object({
  integrationId: z.number().int().positive(),
});

export const integrationIpInputSchema = z.object({
  ip: hostSchema,
});
