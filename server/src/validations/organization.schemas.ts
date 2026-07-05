import z from 'zod';

export const organizationIdSchema = z.number().int().positive().max(999999);
