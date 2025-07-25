import type { KioskConfig } from '@shared/types/kiosk.config';
import { useEffect, useState } from 'react';

const DEFAULT_CONFIG: KioskConfig = {
  cellsPerPage: 6,
  id: 0,
  theme: 'dark',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function useConfigSse() {
  const [config, setConfig] = useState<KioskConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    const es = new EventSource(`${import.meta.env.VITE_API_URL}/sse/config`);

    es.onmessage = (e) => {
      try {
        const cfg = JSON.parse(e.data) as KioskConfig;
        setConfig(cfg);
      } catch {}
    };
    es.onerror = () => {
      es.close();
    };
    return () => {
      es.close();
    };
  }, []);

  return config;
}
