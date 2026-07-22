import type { ScenarioWidgetType } from '@/entities/scenario';
import {
  Cake,
  CalendarDays,
  Clock,
  CloudSun,
  Rss,
  type LucideIcon,
} from 'lucide-react';

export const WIDGET_LABELS: Record<ScenarioWidgetType, string> = {
  birthday: 'Дни рождения',
  rss: 'RSS-лента',
  schedule: 'Расписание',
  info: 'Погода и время',
};

export const WIDGET_ICONS: Record<ScenarioWidgetType, LucideIcon> = {
  birthday: Cake,
  rss: Rss,
  schedule: CalendarDays,
  info: CloudSun,
};

export const WIDGET_DESCRIPTIONS: Record<ScenarioWidgetType, string> = {
  birthday: 'Поздравления сотрудников по списку',
  rss: 'Заголовки из RSS-источников',
  schedule: 'Расписание мероприятий',
  info: 'Часы, дата и прогноз погоды на 7 дней',
};

export const WIDGET_HUES: Record<ScenarioWidgetType, number> = {
  birthday: 320,
  rss: 0,
  schedule: 140,
  info: 200,
};

export type WidgetPresentation = {
  label: string;
  description: string;
  hue: number;
  Icon: LucideIcon;
};

export function getWidgetPresentation(
  type: ScenarioWidgetType,
  offlineMode = false,
): WidgetPresentation {
  if (offlineMode && type === 'info') {
    return {
      label: 'Дата и время',
      description: 'Часы, дата и календарь на месяц',
      hue: WIDGET_HUES.info,
      Icon: Clock,
    };
  }

  return {
    label: WIDGET_LABELS[type],
    description: WIDGET_DESCRIPTIONS[type],
    hue: WIDGET_HUES[type],
    Icon: WIDGET_ICONS[type],
  };
}
