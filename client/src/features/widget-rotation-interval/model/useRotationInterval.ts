import { useUpdateUiConfig } from '@/entities/ui-config';
import { useConfig } from '@/entities/ui-config';
import { useEffect, useState } from 'react';

export function useRotationInterval() {
  const { data: config } = useConfig();
  const updateConfig = useUpdateUiConfig();
  const [intervalSec, setIntervalSec] = useState(0);

  useEffect(() => {
    if (config?.autoSwitchIntervalMs) {
      setIntervalSec(Math.floor(config.autoSwitchIntervalMs / 1000));
    }
  }, [config]);

  const handleInterval = (val: number) => {
    setIntervalSec(val);
    updateConfig.mutate({ data: { autoSwitchIntervalMs: val * 1000 } });
  };

  return { intervalSec, handleInterval };
}
