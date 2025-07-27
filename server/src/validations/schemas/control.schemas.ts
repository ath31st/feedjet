import z from 'zod';
import { widgetTypes } from '@shared/types/widget.js';

export const switchWidgetSchema = z.object({
  widgetType: z.enum(widgetTypes),
});
