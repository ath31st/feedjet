import { useGetBirthdaysByDayMonthRange } from '@/entities/birthday';
import {
  useGetBackgroundByMonth,
  buildBackgroundUrl,
} from '@/entities/birthday-background';
import { useGetBirthdayWidgetTransformByMonth } from '@/entities/birthday-widget-transform';
import { isRotate90, useIsXl } from '@/shared/lib';
import { useMemo } from 'react';

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

  const { data: transformData, isLoading: isLoadingTransform } =
    useGetBirthdayWidgetTransformByMonth(month);

  const { data: backgroundFileName } = useGetBackgroundByMonth(month);

  const backgroundUrl = backgroundFileName
    ? buildBackgroundUrl(backgroundFileName)
    : null;

  const isXl = useIsXl();
  const isEffectiveXl = isRotate90(rotate) ? !isXl : isXl;

  return {
    isLoading,
    birthdays,
    backgroundUrl,
    isEffectiveXl,
    isLoadingTransform,
    transformData,
  };
}
