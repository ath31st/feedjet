import {
  useImageMetadataList,
  useUpdateImageDurations,
} from '@/entities/image';
import { useMemo, useState } from 'react';

const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, val));

export function useRotationInterval(kioskId: number, min = 10, max = 10000) {
  const { data: images = [], isLoading } = useImageMetadataList(kioskId);
  const { mutate: updateImageDurations } = useUpdateImageDurations();

  const serverValue = useMemo(() => {
    if (!images.length) return min;

    const freq = new Map<number, number>();

    for (const img of images) {
      const val = clamp(img.durationSeconds ?? min, min, max);
      freq.set(val, (freq.get(val) || 0) + 1);
    }

    let maxCount = 0;
    let result = min;

    for (const [value, count] of freq.entries()) {
      if (count > maxCount) {
        maxCount = count;
        result = value;
      }
    }

    return result;
  }, [images, min, max]);

  const [localValue, setLocalValue] = useState<number | null>(null);

  const value = localValue ?? serverValue;

  const update = (durationSeconds: number) => {
    const normalized = clamp(durationSeconds, min, max);

    setLocalValue(normalized);

    const updates = images.map((img) => ({
      fileName: img.fileName,
      durationSeconds: normalized,
    }));

    updateImageDurations({
      kioskId,
      updates,
    });
  };

  return { value, update, isLoading };
}
