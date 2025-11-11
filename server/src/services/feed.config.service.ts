import { feedConfigTable } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import type { DbType } from '../container.js';
import type {
  FeedConfig,
  UpdateFeedConfig,
} from '@shared/types/feed.config.js';
import { FeedConfigServiceError } from '../errors/feed.config.error.js';
import logger from '../utils/pino.logger.js';

export class FeedConfigService {
  private readonly db: DbType;

  constructor(db: DbType) {
    this.db = db;
  }

  createDefaultConfig(kioskId: number): FeedConfig {
    try {
      const defaultConfig = this.db
        .insert(feedConfigTable)
        .values({
          kioskId,
          visibleCellCount: 6,
          carouselSize: 6,
          carouselIntervalMs: 30000,
        })
        .returning()
        .get();

      return defaultConfig;
    } catch (err) {
      logger.error({ err }, 'Failed to create default feed config');
      throw new FeedConfigServiceError(
        500,
        'Failed to create default feed config',
      );
    }
  }

  update(kioskId: number, data: Partial<UpdateFeedConfig>): FeedConfig {
    try {
      const updatedConfig = this.db
        .update(feedConfigTable)
        .set(data)
        .where(eq(feedConfigTable.kioskId, kioskId))
        .returning()
        .get();

      if (!updatedConfig) {
        throw new FeedConfigServiceError(404, 'Config not found');
      }

      return updatedConfig;
    } catch (err) {
      logger.error({ err }, 'Failed to update feed config');
      throw new FeedConfigServiceError(500, 'Failed to update feed config');
    }
  }

  getConfig(kioskId: number): FeedConfig {
    const config = this.db
      .select()
      .from(feedConfigTable)
      .where(eq(feedConfigTable.kioskId, kioskId))
      .get();

    if (!config) {
      throw new FeedConfigServiceError(404, 'Config not found');
    }

    return config;
  }

  findMaxCarouselSize(): number | undefined {
    return this.db
      .select({ carouselSize: feedConfigTable.carouselSize })
      .from(feedConfigTable)
      .orderBy(desc(feedConfigTable.carouselSize))
      .limit(1)
      .get()?.carouselSize;
  }
}
