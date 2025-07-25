import type Parser from 'rss-parser';
import type { RawFeedItem } from '../types/feed.js';
import type { FeedItem } from '@shared/types/feed.ts';
import Logger from '../utils/logger.js';
import { sortFeedItemsByDateDescending } from '../utils/feed.items.sorting.js';
import type { RssFeed } from '@shared/types/rss.js';

export class RssParser {
  private readonly maxItems = Number(process.env.MAX_ITEMS) || 10;
  private readonly parser: Parser;

  constructor(parser: Parser) {
    this.parser = parser;
  }

  async parse(url: string): Promise<FeedItem[]> {
    const feed = await this.parser.parseURL(url);
    if (!feed.items) return [];

    return feed.items
      .map((item) => this.mapToFeedItem(item as RawFeedItem))
      .filter((item) => item != null);
  }

  async parseLatestFeedIitems(rssFeeds: RssFeed[]): Promise<FeedItem[]> {
    const promises = rssFeeds.map(async (rssFeed) => {
      try {
        return await this.parse(rssFeed.url);
      } catch (error) {
        Logger.error(`Failed to parse RSS feed: ${rssFeed.url}`, error);
        return [];
      }
    });

    const itemsArrays = await Promise.all(promises);
    const feedItems: FeedItem[] = itemsArrays.flat();

    const sortedItems = sortFeedItemsByDateDescending(feedItems);
    return sortedItems.slice(0, this.maxItems);
  }

  mapToFeedItem(item: RawFeedItem): FeedItem | null {
    if (!item.title || !item.link) return null;

    return {
      title: item.title,
      link: item.link,
      description: item.contentSnippet ?? '',
      image: item.enclosure?.url ?? '',
      categories: item.categories ?? [],
      author: item['dc:creator'] ?? '',
      pubDate: item.pubDate ?? '',
    };
  }
}
