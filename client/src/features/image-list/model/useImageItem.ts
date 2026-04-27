import type { AdminImageInfo } from '@/entities/image';
import { useEffect, useState } from 'react';

export const useImageItem = (
  i: AdminImageInfo,
  globalDuration: number,
  onUpdateDuration: (name: string) => (val: number) => void,
) => {
  const [isManual, setIsManual] = useState(
    !!i.durationSeconds && Number(i.durationSeconds) !== Number(globalDuration),
  );

  useEffect(() => {
    if (
      !i.durationSeconds ||
      Number(i.durationSeconds) === Number(globalDuration)
    ) {
      setIsManual(false);
    } else {
      setIsManual(true);
    }
  }, [globalDuration, i.durationSeconds]);

  const toggleManual = () => {
    const next = !isManual;
    setIsManual(next);

    if (!next) {
      onUpdateDuration(i.fileName)(globalDuration);
    }
  };

  return {
    isManual,
    toggleManual,
  };
};
