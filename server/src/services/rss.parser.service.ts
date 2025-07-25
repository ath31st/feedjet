import type Parser from 'rss-parser';
import type { RawFeedItem } from '../types/feed.js';
import type { FeedItem } from '@shared/types/feed.ts';

export class RssParser {
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
