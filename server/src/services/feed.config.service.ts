import { feedConfigTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { DbType } from '../container.js';
import type {
  FeedConfig,
  UpdateFeedConfig,
} from '@shared/types/feed.config.js';

export class FeedConfigService {
  private readonly configId: number = 1;
  private readonly db: DbType;

  constructor(db: DbType) {
    this.db = db;
  }

  update(data: Partial<UpdateFeedConfig>): FeedConfig | undefined {
    return this.db
      .update(feedConfigTable)
      .set(data)
      .where(eq(feedConfigTable.id, this.configId))
      .returning()
      .get();
  }

  getConfig(): FeedConfig | undefined {
    return this.db
      .select()
      .from(feedConfigTable)
      .where(eq(feedConfigTable.id, this.configId))
      .get();
  }
}
