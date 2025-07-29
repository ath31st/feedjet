import { useEffect, useCallback } from 'react';
import { useEventSource } from '@/shared/api/sse/useEventSource';
import { useUiConfigStore } from '../model/useUiConfigStore';

const UI_CONFIG_SSE_URL = `${import.meta.env.VITE_API_URL}/sse/ui-config`;

export function useUiConfigSse() {
  const setConfig = useUiConfigStore((s) => s.setConfig);
  const initStore = useUiConfigStore((s) => s.initStore);

  useEffect(() => {
    initStore();
  }, [initStore]);

  const onMessage = useCallback(
    (e: MessageEvent) => {
      try {
        const cfg = JSON.parse(e.data);
        console.log(cfg);
        setConfig(cfg);
      } catch {}
    },
    [setConfig],
  );

  useEventSource(UI_CONFIG_SSE_URL, onMessage);
}
