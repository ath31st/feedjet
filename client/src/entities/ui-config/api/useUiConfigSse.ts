import { useEffect, useCallback } from 'react';
import { useEventSource } from '@/shared/api/sse/useEventSource';
import { useUiConfigStore } from '../model/uiConfigStore';
import { SERVER_URL } from '@/shared/config/env';
import { useKioskStore } from '@/entities/kiosk';

export function useUiConfigSse() {
  const setConfig = useUiConfigStore((s) => s.setConfig);
  const fetchUiConfig = useUiConfigStore((s) => s.fetchUiConfig);
  const { currentKiosk, loading } = useKioskStore();

  useEffect(() => {
    if (currentKiosk && !loading) {
      fetchUiConfig(currentKiosk.id);
    }
  }, [fetchUiConfig, currentKiosk, loading]);

  const sseUrl = currentKiosk
    ? `${SERVER_URL}/sse/ui-config/${currentKiosk.id}`
    : null;

  const onMessage = useCallback(
    (e: MessageEvent) => {
      try {
        const cfg = JSON.parse(e.data);
        setConfig(cfg);
      } catch {}
    },
    [setConfig],
  );

  useEventSource(sseUrl, onMessage);
}
