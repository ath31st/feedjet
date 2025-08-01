import { useFeedConfig, useUpdateFeedConfig } from '@/entities/feed-config';
import { useEffect, useState } from 'react';

export function usePagesCount() {
  const { data: config } = useFeedConfig();
  const updateConfig = useUpdateFeedConfig();
  const [pagesCount, setPagesCount] = useState(0);

  useEffect(() => {
    if (config?.pagesCount) {
      setPagesCount(config.pagesCount);
    }
  }, [config]);

  const setCount = (val: number) => {
    setPagesCount(val);
    updateConfig.mutate({ data: { pagesCount: val } });
  };

  return { pagesCount, setCount };
}
