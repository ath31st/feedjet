import { useGetBirthdaysByMonth } from '@/entities/birthday';
import {
  useGetBackgroundByMonth,
  buildBackgroundUrl,
} from '@/entities/birthday-background';
import { isRotate90, useIsXl } from '@/shared/lib';
import { useMemo } from 'react';

export function useBirthdayWidgetModel(rotate: number) {
  const month = new Date().getMonth() + 1;

  const { data: birthdays = [], isLoading } = useGetBirthdaysByMonth(month);
  const { data: backgroundFileName } = useGetBackgroundByMonth(month);

  const backgroundUrl = backgroundFileName
    ? buildBackgroundUrl(backgroundFileName)
    : null;

  const isXl = useIsXl();
  const isEffectiveXl = isRotate90(rotate) ? !isXl : isXl;

  const isTwoColumns = birthdays.length > 12;
  const midIndex = Math.ceil(birthdays.length / 2);

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
  };
}
