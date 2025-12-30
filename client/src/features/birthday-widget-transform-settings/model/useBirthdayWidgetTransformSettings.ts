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
import { useEffect, useState } from 'react';
import { MOCK_BIRTHDAYS } from '../lib/mockBirthdays';

export const useBirthdayWidgetTransformSettings = () => {
  const currentMonth = new Date().getMonth() + 1;
  const [month, setMonth] = useState(currentMonth);
  const [isHalfSetBirthdays, setHalfSetBirthdays] = useState(true);

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
      upsertTransform(localTransform);
    }
  };

  const handleReset = () => {
    if (defaultTransform) {
      const defaultTransformWithMonth = {
        ...defaultTransform,
        month,
      };
      setLocalTransform(defaultTransformWithMonth);
    }
  };

  const handleRollbackChanges = () => {
    if (transformData) {
      setLocalTransform(transformData);
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
    setMonth,
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
    getPreviewBirthdays,
  };
};
