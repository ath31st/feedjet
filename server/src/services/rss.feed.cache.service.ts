import { LRUCache } from 'lru-cache';
import type { FeedItem } from '@shared/types/feed.js';
import type { RssParser } from './rss.parser.service.js';
import type { RssService } from './rss.service.js';
import type { FeedConfigService } from './feed.config.service.js';
import { createServiceLogger } from '../utils/pino.logger.js';

const CACHE_KEY = 'feeds';

export class RssFeedCacheService {
  private readonly cacheTtl = Number(process.env.RSS_CACHE_TTL_MS) || 600_000;
  private readonly cache = new LRUCache<string, FeedItem[]>({
    max: 1,
    ttl: this.cacheTtl,
  });
  private readonly refreshMap = new Map<string, Promise<FeedItem[]>>();
  private readonly logger = createServiceLogger('rssFeedCacheService');

  constructor(
    private readonly rssParser: RssParser,
    private readonly rssService: RssService,
    private readonly feedConfigService: FeedConfigService,
  ) {}

  getCached(): FeedItem[] | undefined {
    return this.cache.get(CACHE_KEY);
  }

  hasCache(): boolean {
    return this.cache.has(CACHE_KEY);
  }

  invalidate(): void {
    this.cache.clear();
    this.logger.debug({ fn: 'invalidate' }, 'Feed cache invalidated');
  }

  refresh(): Promise<FeedItem[]> {
    const existing = this.refreshMap.get(CACHE_KEY);
    if (existing) {
      this.logger.trace({ fn: 'refresh' }, 'Feed refresh already in progress');
      return existing;
    }

    const promise = this.refreshInternal().finally(() => {
      this.refreshMap.delete(CACHE_KEY);
    });

    this.refreshMap.set(CACHE_KEY, promise);
    return promise;
  }

  private async refreshInternal(): Promise<FeedItem[]> {
    const rssFeeds = this.rssService.getActive();

    if (rssFeeds.length === 0) {
      this.logger.debug(
        { rssFeedsCount: 0, fn: 'refreshInternal' },
        'No active RSS feeds found',
      );
      return [];
    }

    const limit = this.feedConfigService.findMaxCarouselSize();
    if (!limit) {
      this.logger.warn(
        { fn: 'refreshInternal' },
        'Feed config (carouselSize) not found, skipping RSS fetch',
      );
      return [];
    }

    try {
      const latestItems = await this.rssParser.parseLatestFeedItems(
        rssFeeds,
        limit,
      );

      if (latestItems.length === 0) {
        this.logger.debug({ fn: 'refreshInternal' }, 'No feed items fetched');
        return [];
      }

      this.cache.set(CACHE_KEY, latestItems);
      this.logger.info(
        {
          rssFeedsCount: rssFeeds.length,
          feedItemsCount: latestItems.length,
          fn: 'refreshInternal',
        },
        'Feed cache refreshed',
      );
      return latestItems;
    } catch (err) {
      this.logger.error(
        { err, fn: 'refreshInternal' },
        'Failed to refresh feed cache',
      );
      return [];
    }
  }
}
