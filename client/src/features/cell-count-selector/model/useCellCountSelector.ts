import { useMainConfig, useUpdateFeedConfig } from '@/entities/feed-config';
import { useEffect, useState } from 'react';

export function useCellCount() {
  const { data: config } = useMainConfig();
  const updateConfig = useUpdateFeedConfig();
  const [cellCount, setCellCount] = useState(0);

  useEffect(() => {
    if (config?.cellsPerPage) {
      setCellCount(config.cellsPerPage);
    }
  }, [config]);

  const setCount = (val: number) => {
    setCellCount(val);
    updateConfig.mutate({ data: { cellsPerPage: val } });
  };

  return { cellCount, setCount };
}
