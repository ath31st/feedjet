import { useFeedConfig, useUpdateFeedConfig } from '@/entities/feed-config';
import { useEffect, useState } from 'react';

export function usePagesCount(min = 1) {
  const { data: config } = useFeedConfig();
  const updateConfig = useUpdateFeedConfig();
  const [pagesCount, setPagesCount] = useState(config?.pagesCount ?? min);

  useEffect(() => {
    if (config?.pagesCount && config.pagesCount !== pagesCount) {
      setPagesCount(config.pagesCount);
    }
  }, [config, pagesCount]);

  const setCount = (val: number) => {
    if (val < min) return;
    setPagesCount(val);
    updateConfig.mutate({ data: { pagesCount: val } });
  };

  return { pagesCount, setCount };
}
