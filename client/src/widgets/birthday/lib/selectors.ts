import { fontSizeBirthdayCard } from './fontSizeBirhtdayCard';

export function calcFontSize(isEffectiveXl: boolean, count: number) {
  if (!isEffectiveXl) return 3;
  return fontSizeBirthdayCard(count);
}

export function calcWidgetWidth(isEffectiveXl: boolean) {
  return isEffectiveXl ? 80 : 90;
}
