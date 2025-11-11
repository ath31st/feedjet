import { useCallback } from 'react';
import { useEventSource } from '@/shared/api';
import { useRssFeedStore, type FeedItem } from '..';
import { SERVER_URL, SSE_URL } from '@/shared/config';

export function useRssFeedSse() {
  const setFeeds = useRssFeedStore((s) => s.setFeeds);

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
