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
  { name: 'light', label: 'Грязный снег', color: '#fefefe' },
  { name: 'dark', label: 'Ночное небо', color: '#052a44' },
  { name: 'flame', label: 'Пламя', color: '#ff6600' },
  { name: 'sepia', label: 'Старая фотография', color: '#a67c52' },
  { name: 'sepia-light', label: 'Пергамент', color: '#d4b98e' },
  { name: 'blue', label: 'Синяя', color: '#2563eb' },
  { name: 'indigo', label: 'Индиго', color: '#4507aa' },
  { name: 'glacier', label: 'Ледник', color: '#3b82f6' },
  { name: 'teal', label: 'Морская волна', color: '#14b8a6' },
  { name: 'green', label: 'Зеленая листва', color: '#22c55e' },
  { name: 'terminal', label: 'Терминал', color: '#0ec206' },
  { name: 'purple', label: 'Аметист', color: '#8b5cf6' },

  { name: 'gold', label: 'Черное золото', color: '#f5c64c' },
  { name: 'silver', label: 'Холодное серебро', color: '#e5e7eb' },
  { name: 'electric', label: 'Неоновый электрик', color: '#00ffff' },
  { name: 'cyborg', label: 'Цифровой неон', color: '#a3e635' },
  { name: 'moss', label: 'Мох', color: '#93c572' },
  { name: 'charcoal', label: 'Древесный уголь', color: '#f45b6a' },
  { name: 'lavender', label: 'Лавандовая ночь', color: '#93c5fd' },
  { name: 'jade', label: 'Нефрит и медь', color: '#8a6e4d' },
  { name: 'ash', label: 'Пепел и вино', color: '#f43f5e' },
  { name: 'forest-fire', label: 'Лесной пожар', color: '#ea580c' },
  { name: 'volcano', label: 'Вулкан', color: '#f87171' },
  { name: 'neon-mint', label: 'Мятный неон', color: '#7cfc00' },
] as const;

export const themes = themesFull.map((t) => t.name);
export type Theme = (typeof themes)[number];

export const widgetTypes = [
  'schedule',
  'video',
  'image',
  'feed',
  'birthday',
  'info',
];
export type WidgetType = (typeof widgetTypes)[number];

export const widgetLabels: Record<WidgetType, string> = {
  schedule: 'Расписание',
  video: 'Видео',
  image: 'Изображения',
  feed: 'Новости',
  birthday: 'Дни рожд.',
  info: 'Информация',
};
