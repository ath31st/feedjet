import {
  useImageMetadataList,
  useUpdateImageDurations,
} from '@/entities/image';
import { useState, useEffect } from 'react';

const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, val));

const DEFAULT_DURATION = 60;

export function useRotationInterval(kioskId: number, min = 10, max = 10000) {
  const { data: images = [], isLoading } = useImageMetadataList(kioskId);
  const { mutate: updateImageDurations } = useUpdateImageDurations();

  const [localValue, setLocalValue] = useState<number | null>(null);

  useEffect(() => {
    setLocalValue(null);
  }, []);

  const value = localValue ?? DEFAULT_DURATION;

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
