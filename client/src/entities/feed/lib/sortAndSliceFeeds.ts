import type { FeedItem } from '..';

export function sortAndSliceFeeds(feedItems: FeedItem[], limit: number) {
  return [...feedItems]
    .sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
    )
    .slice(0, limit);
}
