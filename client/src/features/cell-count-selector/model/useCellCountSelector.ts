import { useFeedConfig, useUpdateFeedConfig } from '@/entities/feed-config';
import { useEffect, useState } from 'react';

export function useCellCount(min = 1) {
  const { data: config } = useFeedConfig();
  const updateConfig = useUpdateFeedConfig();
  const [cellCount, setCellCount] = useState(config?.cellsPerPage ?? min);

  useEffect(() => {
    if (config?.cellsPerPage && config.cellsPerPage !== cellCount) {
      setCellCount(config.cellsPerPage);
    }
  }, [config, cellCount]);

  const setCount = (val: number) => {
    if (val < min) return;
    setCellCount(val);
    updateConfig.mutate({ data: { cellsPerPage: val } });
  };

  return { cellCount, setCount };
}
