import type { KioskConfig } from '@shared/types/kiosk.config';
import { useState, useCallback } from 'react';
import { useEventSource } from './useEventSource';

const DEFAULT_CONFIG: KioskConfig = {
  cellsPerPage: 6,
  id: 0,
  theme: 'dark',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function useConfigSse() {
  const [config, setConfig] = useState<KioskConfig>(DEFAULT_CONFIG);

  const onMessage = useCallback((e: MessageEvent) => {
    try {
      const cfg = JSON.parse(e.data) as KioskConfig;
      setConfig(cfg);
    } catch {}
  }, []);

  useEventSource(`${import.meta.env.VITE_API_URL}/sse/config`, onMessage);

  return config;
}
