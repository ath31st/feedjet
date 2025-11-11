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
      logger.warn({ id }, 'RSS feed not found');
      throw new RssServiceError(404, 'RSS feed not found');
    }

    return rss;
  }

  create(data: NewRssFeed): RssFeed {
    logger.debug({ data }, 'Creating RSS feed');

    try {
      const rss = this.db.insert(rssFeedsTable).values(data).returning().get();
      logger.info({ id: rss.id, url: rss.url }, 'Created RSS feed');
      return rss;
    } catch (err: unknown) {
      if ((err as Error).message.includes('UNIQUE')) {
        logger.warn({ err, data }, 'RSS feed already exists');
        throw new RssServiceError(409, 'RSS feed already exists');
      }

      logger.error({ err, data }, 'Failed to create RSS feed');
      throw new RssServiceError(500, 'Failed to create RSS feed');
    }
  }

  update(id: number, data: Partial<UpdateRssFeed>): RssFeed {
    logger.debug({ id, data }, 'Updating RSS feed');

    try {
      const updatedRss = this.db
        .update(rssFeedsTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(rssFeedsTable.id, id))
        .returning()
        .get();

      if (!updatedRss) {
        logger.warn({ id, data }, 'RSS feed not found for update');
        throw new RssServiceError(404, 'RSS feed not found');
      }

      logger.info({ id, url: updatedRss.url }, 'RSS feed updated successfully');
      return updatedRss;
    } catch (err: unknown) {
      if ((err as Error).message.includes('UNIQUE')) {
        logger.warn({ err, id, data }, 'Duplicate URL');
        throw new RssServiceError(409, 'Duplicate URL');
      }

      logger.error({ err, id, data }, 'Failed to update RSS feed');
      throw new RssServiceError(500, 'Update failed');
    }
  }

  delete(id: number): number {
    const changes = this.db
      .delete(rssFeedsTable)
      .where(eq(rssFeedsTable.id, id))
      .run().changes;

    if (changes > 0) {
      logger.info({ id }, 'Deleted RSS feed');
    } else {
      logger.warn({ id }, 'Attempted to delete non-existing RSS feed');
    }

    return changes;
  }
}
