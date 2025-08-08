import type { FeedItem } from '@shared/types/feed.js';
import type { RawFeedItem } from '../types/feed.js';

export const feedItemMapper = {
  mapToFeedItem(item: RawFeedItem): FeedItem | null {
    if (!item.title || !item.link) return null;

    const domain = (() => {
      try {
        const { hostname } = new URL(item.link);
        return hostname.replace(/^www\./, '');
      } catch {
        return '';
      }
    })();

    const author = [domain, item['dc:creator']].filter(Boolean).join(' | ');

    return {
      title: item.title,
      link: item.link,
      description: item.contentSnippet ?? '',
      image: item.enclosure?.url ?? '',
      categories: item.categories ?? [],
      author,
      pubDate: item.pubDate ?? '',
    };
  },
};
