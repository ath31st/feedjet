import { useEffect, useCallback } from 'react';
import { useEventSource } from './useEventSource';
import { useKioskConfigStore } from '../../stores/kioskConfigStrore';

export function useKioskConfigInit() {
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

  useEventSource(`${import.meta.env.VITE_API_URL}/sse/config`, onMessage);
}
