export interface UiConfig {
  id: number;
  theme: Theme;
  screenRotation: ScreenRotation;
  animationMode: AnimationType;
  seasonOverlay: SeasonOverlayMode;
  kioskId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewUiConfig {
  theme: Theme;
  screenRotation: ScreenRotation;
  animationMode: AnimationType;
  seasonOverlay: SeasonOverlayMode;
}

export interface UpdateUiConfig {
  theme?: Theme;
  screenRotation?: ScreenRotation;
  animationMode?: AnimationType;
  seasonOverlay?: SeasonOverlayMode;
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

export const screenRotations = [-180, -90, 0, 90, 180] as const;
export type ScreenRotation = (typeof screenRotations)[number];

export const animationTypes = ['full', 'lite'] as const;
export type AnimationType = (typeof animationTypes)[number];

export const seasonOverlayModes = [
  'auto',
  'winter',
  'spring',
  'summer',
  'autumn',
  'off',
] as const;
export type SeasonOverlayMode = (typeof seasonOverlayModes)[number];

export const seasonOverlayLabels: Record<SeasonOverlayMode, string> = {
  auto: 'Авто',
  winter: 'Зима',
  spring: 'Весна',
  summer: 'Лето',
  autumn: 'Осень',
  off: 'Откл',
};

export const animationLabels: Record<AnimationType, string> = {
  full: 'Полная',
  lite: 'Облегчённая',
};
