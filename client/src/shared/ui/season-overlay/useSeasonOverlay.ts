export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

export const getCurrentSeason = (): Season => {
  const month = new Date().getMonth();
  if (month === 11 || month === 0 || month === 1) return 'winter';
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  return 'autumn';
};
