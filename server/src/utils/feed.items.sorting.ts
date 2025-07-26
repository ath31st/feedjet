import type { FeedItem } from '@shared/types/feed.js';

export function sortFeedItemsByDateDescending(feedItems: FeedItem[]) {
  return [...feedItems].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
  );
}
