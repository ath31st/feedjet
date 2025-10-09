import { useEffect, useCallback } from 'react';
import { useEventSource } from '@/shared/api';
import { useFeedConfigStore } from '..';
import { SERVER_URL, SSE_URL } from '@/shared/config';
import { useKioskStore } from '@/entities/kiosk';

export function useFeedConfigSse() {
  const setConfig = useFeedConfigStore((s) => s.setConfig);
  const fetchFeedConfig = useFeedConfigStore((s) => s.fetchFeedConfig);
  const { currentKiosk, loading } = useKioskStore();

  useEffect(() => {
    if (currentKiosk && !loading) {
      fetchFeedConfig(currentKiosk.id);
    }
  }, [fetchFeedConfig, currentKiosk, loading]);

  const sseUrl = currentKiosk
    ? `${SERVER_URL}${SSE_URL.FEED_CONFIG(currentKiosk.id)}`
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
