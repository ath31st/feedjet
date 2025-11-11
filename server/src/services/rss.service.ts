import type { DbType } from '../container.js';
import { rssFeedsTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { NewRssFeed, RssFeed, UpdateRssFeed } from '@shared/types/rss.js';
import { RssServiceError } from '../errors/rss.error.js';
import logger from '../utils/pino.logger.js';

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

  findById(id: number): RssFeed {
    const rss = this.db
      .select()
      .from(rssFeedsTable)
      .where(eq(rssFeedsTable.id, id))
      .get();

    if (!rss) {
      throw new RssServiceError(404, 'RSS feed not found');
    }

    return rss;
  }

  create(data: NewRssFeed): RssFeed {
    try {
      return this.db.insert(rssFeedsTable).values(data).returning().get();
    } catch (err: unknown) {
      if ((err as Error).message.includes('UNIQUE')) {
        throw new RssServiceError(409, 'RSS feed already exists');
      }

      logger.error({ err, data }, 'Failed to create RSS feed');
      throw new RssServiceError(500, 'Failed to create RSS feed');
    }
  }

  update(id: number, data: Partial<UpdateRssFeed>): RssFeed {
    try {
      const updatedRss = this.db
        .update(rssFeedsTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(rssFeedsTable.id, id))
        .returning()
        .get();

      if (!updatedRss) {
        throw new RssServiceError(404, 'RSS feed not found');
      }

      return updatedRss;
    } catch (err: unknown) {
      if ((err as Error).message.includes('UNIQUE')) {
        throw new RssServiceError(409, 'Duplicate URL');
      }

      logger.error({ err, data }, 'Update failed');
      throw new RssServiceError(500, 'Update failed');
    }
  }

  delete(id: number): number {
    return this.db.delete(rssFeedsTable).where(eq(rssFeedsTable.id, id)).run()
      .changes;
  }
}
