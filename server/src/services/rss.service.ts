import type { DbType } from '../container.js';
import { rssFeedsTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { NewRssFeed, RssFeed, UpdateRssFeed } from '@shared/types/rss.js';
import Logger from '../utils/logger.js';
import { RssServiceError } from '../errors/rss.error.js';

export class RssService {
  private readonly db: DbType;

  constructor(db: DbType) {
    this.db = db;
  }

  getAll(): RssFeed[] {
    return this.db.select().from(rssFeedsTable).all();
  }

  getActive(): RssFeed[] {
    return this.db
      .select()
      .from(rssFeedsTable)
      .where(eq(rssFeedsTable.isActive, true))
      .all();
  }

  getById(id: number): RssFeed | undefined {
    return this.db
      .select()
      .from(rssFeedsTable)
      .where(eq(rssFeedsTable.id, id))
      .get();
  }

  create(data: NewRssFeed): RssFeed {
    try {
      return this.db.insert(rssFeedsTable).values(data).returning().get();
    } catch (err: unknown) {
      if ((err as Error).message.includes('UNIQUE')) {
        throw new RssServiceError('RSS feed already exists');
      }

      Logger.error(err);
      throw new RssServiceError('Failed to create RSS feed');
    }
  }

  update(id: number, data: Partial<UpdateRssFeed>): RssFeed | undefined {
    try {
      return this.db
        .update(rssFeedsTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(rssFeedsTable.id, id))
        .returning()
        .get();
    } catch (err: unknown) {
      if ((err as Error).message.includes('UNIQUE')) {
        throw new RssServiceError('Duplicate URL');
      }

      Logger.error(err);
      throw new RssServiceError('Update failed');
    }
  }

  delete(id: number): number {
    return this.db.delete(rssFeedsTable).where(eq(rssFeedsTable.id, id)).run()
      .changes;
  }
}
