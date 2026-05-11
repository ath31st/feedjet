import type { ScenarioWidgetType } from '@/entities/scenario';
import { Cake, CalendarDays, CloudSun, Rss } from 'lucide-react';

export const WIDGET_LABELS: Record<ScenarioWidgetType, string> = {
  birthday: 'Дни рождения',
  rss: 'RSS-лента',
  schedule: 'Расписание',
  info: 'Погода и время',
};

export const WIDGET_ICONS: Record<
  ScenarioWidgetType,
  React.FC<{ size?: number; className?: string }>
> = {
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
