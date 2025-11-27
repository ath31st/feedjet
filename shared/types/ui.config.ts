export interface UiConfig {
  id: number;
  rotatingWidgets: WidgetType[];
  autoSwitchIntervalMs: number;
  theme: Theme;
  kioskId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewUiConfig {
  theme: Theme;
  rotatingWidgets: WidgetType[];
  autoSwitchIntervalMs: number;
}

export interface UpdateUiConfig {
  theme?: Theme;
  rotatingWidgets?: WidgetType[];
  autoSwitchIntervalMs?: number;
}

export const themesFull = [
  { name: 'light', label: 'Светлая', color: '#fefefe' },
  { name: 'dark', label: 'Тёмная', color: '#0f172a' },
  { name: 'oled', label: 'Глубокая чёрная', color: '#000000' },
  { name: 'amber', label: 'Золотистая', color: '#fbbf24' },
  { name: 'sepia', label: 'Сепия', color: '#a67c52' },
  { name: 'sepia-light', label: 'Светлая сепия', color: '#d4b98e' },
  { name: 'blue', label: 'Синяя', color: '#2563eb' },
  { name: 'indigo', label: 'Глубокая синяя', color: '#4f46e5' },
  { name: 'glacier', label: 'Прохладный лед', color: '#3b82f6' },
  { name: 'teal', label: 'Бирюзовая', color: '#14b8a6' },
  { name: 'green', label: 'Зелёная', color: '#22c55e' },
  { name: 'terminal', label: 'Зеленый терминал', color: '#16a34a' },
  { name: 'red', label: 'Красная', color: '#ef4444' },
  { name: 'rose', label: 'Розовая', color: '#fb7185' },
  { name: 'fuchsia', label: 'Пурпурная', color: '#c026d3' },
  { name: 'purple', label: 'Фиолетовая', color: '#8b5cf6' },
] as const;

export const themes = themesFull.map((t) => t.name);
export type Theme = (typeof themes)[number];

export const widgetTypes = ['schedule', 'video', 'feed', 'birthday', 'info'];
export type WidgetType = (typeof widgetTypes)[number];

export const widgetLabels: Record<WidgetType, string> = {
  schedule: 'Расписание',
  video: 'Видео',
  feed: 'Новости',
  birthday: 'Дни рожд.',
  info: 'Информация',
};
