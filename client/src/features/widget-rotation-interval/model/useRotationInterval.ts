import { useUpdateUiConfig } from '@/entities/ui-config';
import { useConfig } from '@/entities/ui-config';
import { useEffect, useState } from 'react';

export function useRotationInterval(min = 10, max = 10000) {
  const { data: config } = useConfig();
  const updateConfig = useUpdateUiConfig();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (config?.autoSwitchIntervalMs) {
      setValue(Math.floor(config.autoSwitchIntervalMs / 1000));
    }
  }, [config]);

  const update = (val: number) => {
    const clamped = Math.min(Math.max(val, min), max);
    setValue(clamped);
    updateConfig.mutate({ data: { autoSwitchIntervalMs: clamped * 1000 } });
  };

  return { value, update };
}
