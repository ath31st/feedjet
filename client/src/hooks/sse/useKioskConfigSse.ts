import { useEffect, useCallback } from 'react';
import { useEventSource } from './useEventSource';
import { useKioskConfigStore } from '../../stores/kioskConfigStrore';

const KIOSK_CONFIG_SSE_URL = `${import.meta.env.VITE_API_URL}/sse/config`;

export function useKioskConfigSse() {
  const setConfig = useKioskConfigStore((s) => s.setConfig);
  const init = useKioskConfigStore((s) => s.initStore);

  useEffect(() => {
    init();
  }, [init]);

  const onMessage = useCallback(
    (e: MessageEvent) => {
      try {
        const cfg = JSON.parse(e.data);
        setConfig(cfg);
      } catch {}
    },
    [setConfig],
  );

  useEventSource(KIOSK_CONFIG_SSE_URL, onMessage);
}
