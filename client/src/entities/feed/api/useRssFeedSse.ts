import { useEffect, useCallback } from 'react';
import { useEventSource } from '@/shared/api/sse/useEventSource';
import { useRssFeedStore, type FeedItem } from '..';
import { SERVER_URL } from '@/shared/config/env';

const FEED_SSE_URL = `${SERVER_URL}/sse/feed`;

export function useRssFeedSse() {
  const initStore = useRssFeedStore((s) => s.initStore);
  const setFeeds = useRssFeedStore((s) => s.setFeeds);

  useEffect(() => {
    initStore();
  }, [initStore]);

  const onMessage = useCallback(
    (e: MessageEvent) => {
      try {
        const items = JSON.parse(e.data) as Array<FeedItem>;
        setFeeds(items);
      } catch {
        console.error(e);
      }
    },
    [setFeeds],
  );

  useEventSource(FEED_SSE_URL, onMessage);
}
