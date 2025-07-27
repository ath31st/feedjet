import { useEffect, useCallback } from 'react';
import { useEventSource } from '../../../shared/api/sse/useEventSource';
import { useRssFeedStore } from '../model/rssFeedStore';

const FEED_SSE_URL = `${import.meta.env.VITE_API_URL}/sse/feed`;

export function useRssFeedSse() {
  const initStore = useRssFeedStore((s) => s.initStore);
  const setFeeds = useRssFeedStore((s) => s.setFeeds);

  useEffect(() => {
    initStore();
  }, [initStore]);

  const onMessage = useCallback(
    (e: MessageEvent) => {
      try {
        const items = JSON.parse(e.data) as Array<
          import('@shared/types/feed').FeedItem
        >;
        setFeeds(items);
      } catch {}
    },
    [setFeeds],
  );

  useEventSource(FEED_SSE_URL, onMessage);
}
