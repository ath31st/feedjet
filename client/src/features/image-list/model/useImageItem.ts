import type { AdminImageInfo } from '@/entities/image';
import { useEffect, useState } from 'react';

export const useImageItem = (
  i: AdminImageInfo,
  globalDuration: number,
  onUpdateDuration: (name: string) => (val: number) => void,
) => {
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    setIsManual(false);
  }, []);

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
