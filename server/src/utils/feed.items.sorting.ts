import type { FeedItem } from '@shared/types/feed.js';

export function sortFeedItemsByDateDescending(feedItems: FeedItem[]) {
  const sortedItems = feedItems.sort(
    (a, b) => new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime(),
  );

  return sortedItems;
}
