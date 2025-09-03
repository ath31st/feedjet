import { useEffect, useCallback } from 'react';
import { useEventSource } from '@/shared/api/sse/useEventSource';
import { useUiConfigStore } from '../model/uiConfigStore';
import { SERVER_URL } from '@/shared/config/env';

const UI_CONFIG_SSE_URL = `${SERVER_URL}/sse/ui-config`;

export function useUiConfigSse() {
  const setConfig = useUiConfigStore((s) => s.setConfig);
  const fetchUiConfig = useUiConfigStore((s) => s.fetchUiConfig);

  useEffect(() => {
    fetchUiConfig();
  }, [fetchUiConfig]);

  const onMessage = useCallback(
    (e: MessageEvent) => {
      try {
        const cfg = JSON.parse(e.data);
        setConfig(cfg);
      } catch {}
    },
    [setConfig],
  );

  useEventSource(UI_CONFIG_SSE_URL, onMessage);
}
