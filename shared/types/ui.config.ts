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
  { name: 'light', label: 'Грязный снег', colors: ['#bcc3d2'] },
  { name: 'dark', label: 'Ночное небо', colors: ['#121a21'] },
  { name: 'flame', label: 'Пламя', colors: ['#dd643c'] },
  { name: 'olive', label: 'Олива', colors: ['#8db143'] },
  { name: 'sepia-light', label: 'Пергамент', colors: ['#cb8c4d'] },
  { name: 'blue', label: 'Синяя', colors: ['#4775d1'] },
  { name: 'indigo', label: 'Индиго', colors: ['#584dcb'] },
  { name: 'glacier', label: 'Ледник', colors: ['#70a7c2'] },
  { name: 'teal', label: 'Морская волна', colors: ['#40bfbf'] },
  { name: 'green', label: 'Зеленая листва', colors: ['#40bf95'] },
  { name: 'terminal', label: 'Терминал', colors: ['#30e830'] },
  { name: 'purple', label: 'Аметист', colors: ['#995cd6'] },

  { name: 'gold', label: 'Черное золото', colors: ['#322929', '#f4c025'] },
  { name: 'silver', label: 'Холодное серебро', colors: ['#4c5567', '#d7d8db'] },
  {
    name: 'electric',
    label: 'Неоновый электрик',
    colors: ['#2e4760', '#1fd5f9'],
  },
  { name: 'cyborg', label: 'Цифровой неон', colors: ['#45525e', '#6af425'] },
  { name: 'moss', label: 'Мох', colors: ['#5a6a39', '#e8c930'] },
  { name: 'charcoal', label: 'Древесный уголь', colors: ['#394756', '#dd573c'] },
  {
    name: 'lavender',
    label: 'Лавандовая ночь',
    colors: ['#3c3659', '#ad5cd6'],
  },
  { name: 'jade', label: 'Нефрит и медь', colors: ['#2a6f6f', '#d7a542'] },
  { name: 'ash', label: 'Пепел и вино', colors: ['#494f5a', '#d14753'] },
  {
    name: 'forest-fire',
    label: 'Лесной пожар',
    colors: ['#52523d', '#dd7f3c'],
  },
  { name: 'volcano', label: 'Вулкан', colors: ['#673b32', '#e8304f'] },
  { name: 'neon-mint', label: 'Мятный неон', colors: ['#36635c', '#19e65e'] },

  {
    name: 'aurora',
    label: 'Северное сияние',
    colors: ['#2a366f', '#34b29d', '#e052b1'],
  },
  {
    name: 'harbor',
    label: 'Закат в гавани',
    colors: ['#314c72', '#e26a36', '#ddac3c'],
  },
  {
    name: 'tropic',
    label: 'Тропики',
    colors: ['#317265', '#e24d36', '#ddbc3c'],
  },
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
