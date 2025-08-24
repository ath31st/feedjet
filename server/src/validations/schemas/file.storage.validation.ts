import z from 'zod';

export const fileParamsSchema = z.instanceof(FormData);
