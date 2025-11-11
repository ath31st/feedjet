import type Parser from 'rss-parser';
import type { RawFeedItem } from '../types/feed.js';
import type { FeedItem } from '@shared/types/feed.ts';
import { sortFeedItemsByDateDescending } from '../utils/feed.items.sorting.js';
import type { RssFeed } from '@shared/types/rss.js';
import { feedItemMapper } from '../mappers/feed.item.mapper.js';
import { createServiceLogger } from '../utils/pino.logger.js';

export class RssParser {
  private readonly maxItems = Number(process.env.MAX_ITEMS) || 10;
  private readonly parser: Parser;
  private readonly logger = createServiceLogger('rssParserService');

  constructor(parser: Parser) {
    this.parser = parser;
  }

  async parse(url: string): Promise<FeedItem[]> {
    const feed = await this.parser.parseURL(url);
    if (!feed.items) {
      this.logger.warn({ url, fn: 'parse' }, 'Feed has no items');
      return [];
    }

    const items = feed.items
      .map((item) => feedItemMapper.mapToFeedItem(item as RawFeedItem))
      .filter((item) => item != null);

    this.logger.debug(
      { url, count: items.length, fn: 'parse' },
      'Parsed feed successfully',
    );
    return items;
  }

  async parseLatestFeedIitems(
    rssFeeds: RssFeed[],
    limit?: number,
  ): Promise<FeedItem[]> {
    const promises = rssFeeds.map(async (rssFeed) => {
      try {
        return await this.parse(rssFeed.url);
      } catch (error) {
        this.logger.error(
          { error, rssFeedId: rssFeed.id, url: rssFeed.url, fn: 'parse' },
          'Failed to parse RSS feed',
        );
        return [];
      }
    });

    const itemsArrays = await Promise.all(promises);
    const feedItems: FeedItem[] = itemsArrays.flat();
    this.logger.info(
      {
        totalFeeds: rssFeeds.length,
        totalItems: feedItems.length,
        fn: 'parse',
      },
      'Aggregated feed items',
    );

    const sortedItems = sortFeedItemsByDateDescending(feedItems);
    return sortedItems.slice(0, limit || this.maxItems);
  }
}
