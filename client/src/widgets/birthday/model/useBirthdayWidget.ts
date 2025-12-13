import { useGetBirthdaysByDayMonthRange } from '@/entities/birthday';
import {
  useGetBackgroundByMonth,
  buildBackgroundUrl,
} from '@/entities/birthday-background';
import { isRotate90, useIsXl } from '@/shared/lib';
import { useMemo } from 'react';
import type { Season } from '../ui/SeasonOverlay';

export function useBirthdayWidgetModel(rotate: number) {
  const { start, end, month } = useMemo(() => {
    const now = new Date();
    const month = now.getMonth() + 1;

    const start = new Date(now);
    start.setDate(now.getDate() - 2);

    const end = new Date(now);
    end.setDate(now.getDate() + 5);

    return { start, end, month };
  }, []);

  const { data: birthdays = [], isLoading } = useGetBirthdaysByDayMonthRange(
    start,
    end,
  );

  const { data: backgroundFileName } = useGetBackgroundByMonth(month);

  const backgroundUrl = backgroundFileName
    ? buildBackgroundUrl(backgroundFileName)
    : null;

  const isXl = useIsXl();
  const isEffectiveXl = isRotate90(rotate) ? !isXl : isXl;

  const isTwoColumns = birthdays.length > 12;
  const midIndex = Math.ceil(birthdays.length / 2);

  const getCurrentSeason = (): Season => {
    const month = new Date().getMonth();
    if (month === 11 || month === 0 || month === 1) return 'winter';
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    return 'autumn';
  };

  const columns = useMemo(() => {
    if (!isTwoColumns) return [birthdays, []];
    return [birthdays.slice(0, midIndex), birthdays.slice(midIndex)];
  }, [isTwoColumns, birthdays, midIndex]);

  return {
    isLoading,
    birthdays,
    backgroundUrl,
    isEffectiveXl,
    isTwoColumns,
    columns,
    currentSeason: getCurrentSeason(),
  };
}
