import { useEffect, useCallback } from 'react';
import { useEventSource } from '@/shared/api/sse/useEventSource';
import { useFeedConfigStore } from '..';

const FEED_CONFIG_SSE_URL = `${import.meta.env.VITE_API_URL}/sse/feed-config`;

export function useFeedConfigSse() {
  const setConfig = useFeedConfigStore((s) => s.setConfig);
  const init = useFeedConfigStore((s) => s.initStore);

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

  useEventSource(FEED_CONFIG_SSE_URL, onMessage);
}
