import {
  buildBackgroundUrl,
  useGetBackgroundByMonth,
} from '@/entities/birthday-background';
import {
  useGetBirthdayWidgetTransformByMonth,
  useGetDefaultBirthdayWidgetTransform,
  useUpsertBirthdayWidgetTransform,
  type BirthdayWidgetTransform,
} from '@/entities/birthday-widget-transform';
import { queryClient, trpcWithProxy } from '@/shared/api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MOCK_BIRTHDAYS } from '../lib/mockBirthdays';

export const useBirthdayWidgetTransformSettings = () => {
  const currentMonth = new Date().getMonth() + 1;
  const [month, setMonth] = useState(currentMonth);
  const [isHalfSetBirthdays, setHalfSetBirthdays] = useState(true);
  const [isCopyMode, setIsCopyMode] = useState(false);

  const { data: transformData, isLoading: isTransformLoading } =
    useGetBirthdayWidgetTransformByMonth(month);
  const { data: defaultTransform } = useGetDefaultBirthdayWidgetTransform();
  const { mutate: upsertTransform, isPending: isUpdating } =
    useUpsertBirthdayWidgetTransform();
  const { data: backgroundFileName, isLoading: isBackgroundLoading } =
    useGetBackgroundByMonth(month);
  const backgroundUrl = backgroundFileName
    ? buildBackgroundUrl(backgroundFileName)
    : null;

  const [localTransform, setLocalTransform] =
    useState<BirthdayWidgetTransform | null>(null);

  const handleSave = () => {
    if (localTransform) {
      setIsCopyMode(false);
      upsertTransform(localTransform);
    }
  };

  const handleReset = () => {
    if (defaultTransform) {
      setIsCopyMode(false);
      const defaultTransformWithMonth = {
        ...defaultTransform,
        month,
      };
      setLocalTransform(defaultTransformWithMonth);
    }
  };

  const handleRollbackChanges = () => {
    setIsCopyMode(false);
    if (transformData) {
      setLocalTransform(transformData);
    }
  };

  const handleToggleCopyMode = () => {
    setIsCopyMode((prev) => !prev);
  };

  const handleMonthChange = async (nextMonth: number) => {
    if (!isCopyMode) {
      setMonth(nextMonth);
      return;
    }

    if (nextMonth === month) {
      setIsCopyMode(false);
      return;
    }

    try {
      const source = await queryClient.fetchQuery(
        trpcWithProxy.birthdayWidgetTransform.getByMonth.queryOptions({
          month: nextMonth,
        }),
      );

      setLocalTransform({ ...source, month });
      setIsCopyMode(false);
      toast.success('Конфиг скопирован — сохраните изменения');
    } catch {
      toast.error('Не удалось скопировать конфиг');
      setIsCopyMode(false);
    }
  };

  const getPreviewBirthdays = () => {
    if (!isHalfSetBirthdays) return MOCK_BIRTHDAYS;

    const halfIndex = Math.floor(MOCK_BIRTHDAYS.length / 2);
    return MOCK_BIRTHDAYS.slice(
      0,
      isHalfSetBirthdays ? halfIndex : MOCK_BIRTHDAYS.length,
    );
  };

  useEffect(() => {
    if (transformData) setLocalTransform(transformData);
  }, [transformData]);

  return {
    month,
    isCopyMode,
    isHalfSetBirthdays,
    setHalfSetBirthdays,
    transformData,
    defaultTransform,
    upsertTransform,
    isUpdating,
    isTransformLoading,
    isBackgroundLoading,
    backgroundFileName,
    backgroundUrl,
    localTransform,
    setLocalTransform,
    handleSave,
    handleReset,
    handleRollbackChanges,
    handleToggleCopyMode,
    handleMonthChange,
    getPreviewBirthdays,
  };
};
