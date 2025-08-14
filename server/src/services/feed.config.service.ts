import { feedConfigTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { DbType } from '../container.js';
import type {
  FeedConfig,
  UpdateFeedConfig,
} from '@shared/types/feed.config.js';
import { FeedConfigServiceError } from '../errors/feed.config.error.js';
import Logger from '../utils/logger.js';

export class FeedConfigService {
  private readonly configId: number = 1;
  private readonly db: DbType;

  constructor(db: DbType) {
    this.db = db;
  }

  update(data: Partial<UpdateFeedConfig>): FeedConfig {
    try {
      const updatedConfig = this.db
        .update(feedConfigTable)
        .set(data)
        .where(eq(feedConfigTable.id, this.configId))
        .returning()
        .get();

      if (!updatedConfig) {
        throw new FeedConfigServiceError(404, 'Config not found');
      }

      return updatedConfig;
    } catch (err) {
      Logger.error(err);
      throw new FeedConfigServiceError(500, 'Failed to update feed config');
    }
  }

  getConfig(): FeedConfig | undefined {
    return this.db
      .select()
      .from(feedConfigTable)
      .where(eq(feedConfigTable.id, this.configId))
      .get();
  }
}
