import { useEffect, useCallback } from 'react';
import { useEventSource } from '@/shared/api/sse/useEventSource';
import { useRssFeedStore, type FeedItem } from '..';
import { SERVER_URL, SSE_URL } from '@/shared/config';

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

  useEventSource(`${SERVER_URL}${SSE_URL.FEED}`, onMessage);
}
