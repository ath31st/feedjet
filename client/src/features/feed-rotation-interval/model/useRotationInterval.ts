import { useFeedConfig, useUpdateFeedConfig } from '@/entities/feed-config';
import { useEffect, useState } from 'react';

export function useRotationInterval(min = 10, max = 10000) {
  const { data: config } = useFeedConfig();
  const updateConfig = useUpdateFeedConfig();
  const [value, setValue] = useState(min);

  useEffect(() => {
    if (config?.carouselIntervalMs) {
      const seconds = Math.floor(config.carouselIntervalMs / 1000);
      if (seconds >= min && seconds <= max) {
        setValue(seconds);
      }
    }
  }, [config, min, max]);

  const update = (val: number) => {
    const clamped = Math.min(Math.max(val, min), max);
    setValue(clamped);
    updateConfig.mutate({ data: { carouselIntervalMs: clamped * 1000 } });
  };

  return { value, update };
}
