import type { SeasonOverlayMode } from '@/entities/ui-config';

export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

const getCurrentSeason = (): Season => {
  const month = new Date().getMonth();
  if (month === 11 || month === 0 || month === 1) return 'winter';
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  return 'autumn';
};

export const resolveSeason = (mode: SeasonOverlayMode): Season | null => {
  if (mode === 'off') return null;
  if (mode === 'auto') return getCurrentSeason();
  return mode;
};

export const random = (min: number, max: number) =>
  Math.random() * (max - min) + min;
