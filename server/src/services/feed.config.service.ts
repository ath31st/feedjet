import { feedConfigTable } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import type { DbType } from '../container.js';
import type {
  FeedConfig,
  UpdateFeedConfig,
} from '@shared/types/feed.config.js';
import { FeedConfigServiceError } from '../errors/feed.config.error.js';
import { createServiceLogger } from '../utils/pino.logger.js';

export class FeedConfigService {
  private readonly db: DbType;
  private readonly logger = createServiceLogger('feedConfigService');

  constructor(db: DbType) {
    this.db = db;
  }

  createDefaultConfig(kioskId: number): FeedConfig {
    this.logger.debug(
      { kioskId, fn: 'createDefaultConfig' },
      'Creating default feed config',
    );

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

      this.logger.info(
        { kioskId, defaultConfig, fn: 'createDefaultConfig' },
        'Default feed config created',
      );
      return defaultConfig;
    } catch (err) {
      this.logger.error(
        { err, kioskId, fn: 'createDefaultConfig' },
        'Failed to create default feed config',
      );
      throw new FeedConfigServiceError(
        500,
        'Failed to create default feed config',
      );
    }
  }

  update(kioskId: number, data: Partial<UpdateFeedConfig>): FeedConfig {
    this.logger.debug({ kioskId, data, fn: 'update' }, 'Updating feed config');

    try {
      const updatedConfig = this.db
        .update(feedConfigTable)
        .set(data)
        .where(eq(feedConfigTable.kioskId, kioskId))
        .returning()
        .get();

      if (!updatedConfig) {
        this.logger.warn(
          { kioskId, data, fn: 'update' },
          'Feed config not found for update',
        );
        throw new FeedConfigServiceError(404, 'Config not found');
      }

      this.logger.info(
        { kioskId, updatedConfig, fn: 'update' },
        'Feed config updated successfully',
      );
      return updatedConfig;
    } catch (err) {
      this.logger.error(
        { err, kioskId, data, fn: 'update' },
        'Failed to update feed config',
      );
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
      this.logger.warn({ kioskId, fn: 'getConfig' }, 'Feed config not found');
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
