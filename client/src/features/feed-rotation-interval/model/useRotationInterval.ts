import { useFeedConfig, useUpdateFeedConfig } from '@/entities/feed-config';
import { useEffect, useState } from 'react';

export function useRotaionInterval() {
  const { data: config } = useFeedConfig();
  const updateConfig = useUpdateFeedConfig();
  const [intervalSec, setIntervalSec] = useState(0);

  useEffect(() => {
    if (config?.carouselIntervalMs) {
      setIntervalSec(Math.floor(config.carouselIntervalMs / 1000));
    }
  }, [config]);

  const handleInterval = (val: number) => {
    setIntervalSec(val);
    updateConfig.mutate({ data: { carouselIntervalMs: val * 1000 } });
  };

  return { intervalSec, handleInterval };
}
