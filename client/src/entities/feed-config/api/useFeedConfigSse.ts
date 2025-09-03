import { useEffect, useCallback } from 'react';
import { useEventSource } from '@/shared/api/sse/useEventSource';
import { useFeedConfigStore } from '..';
import { SERVER_URL } from '@/shared/config/env';

const FEED_CONFIG_SSE_URL = `${SERVER_URL}/sse/feed-config`;

export function useFeedConfigSse() {
  const setConfig = useFeedConfigStore((s) => s.setConfig);
  const fetchFeedConfig = useFeedConfigStore((s) => s.fetchFeedConfig);

  useEffect(() => {
    fetchFeedConfig();
  }, [fetchFeedConfig]);

  const onMessage = useCallback(
    (e: MessageEvent) => {
      try {
        const cfg = JSON.parse(e.data);
        setConfig(cfg);
      } catch {}
    },
    [setConfig],
  );

  useEventSource(FEED_CONFIG_SSE_URL, onMessage);
}
