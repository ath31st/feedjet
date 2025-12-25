import z from 'zod';

export const birthdayWidgetTransformInputSchema = z.object({
  posX: z.number().int().min(0).max(100),
  posY: z.number().int().min(0).max(100),
  fontScale: z.number().int().min(50).max(300),
  rotateZ: z.number().int().min(-180).max(180),
  rotateX: z.number().int().min(-90).max(90),
  rotateY: z.number().int().min(-90).max(90),
  lineGap: z.number().int().min(50).max(300),
});
