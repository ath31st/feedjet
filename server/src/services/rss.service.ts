import type { DbType } from '../container.js';
import { rssFeedsTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { NewRssFeed, RssFeed, UpdateRssFeed } from '@shared/types/rss.js';
import { RssServiceError } from '../errors/rss.error.js';
import { createServiceLogger } from '../utils/pino.logger.js';

export class RssService {
  private readonly db: DbType;
  private readonly logger = createServiceLogger('rssService');

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
      this.logger.warn({ id, fn: 'findById' }, 'RSS feed not found');
      throw new RssServiceError(404, 'RSS feed not found');
    }

    return rss;
  }

  create(data: NewRssFeed): RssFeed {
    this.logger.debug({ data, fn: 'create' }, 'Creating RSS feed');

    try {
      const rss = this.db.insert(rssFeedsTable).values(data).returning().get();
      this.logger.info(
        { id: rss.id, url: rss.url, fn: 'create' },
        'Created RSS feed',
      );
      return rss;
    } catch (err: unknown) {
      if ((err as Error).message.includes('UNIQUE')) {
        this.logger.warn(
          { err, data, fn: 'create' },
          'RSS feed already exists',
        );
        throw new RssServiceError(409, 'RSS feed already exists');
      }

      this.logger.error(
        { err, data, fn: 'create' },
        'Failed to create RSS feed',
      );
      throw new RssServiceError(500, 'Failed to create RSS feed');
    }
  }

  update(id: number, data: Partial<UpdateRssFeed>): RssFeed {
    this.logger.debug({ id, data, fn: 'update' }, 'Updating RSS feed');

    try {
      const updatedRss = this.db
        .update(rssFeedsTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(rssFeedsTable.id, id))
        .returning()
        .get();

      if (!updatedRss) {
        this.logger.warn(
          { id, data, fn: 'update' },
          'RSS feed not found for update',
        );
        throw new RssServiceError(404, 'RSS feed not found');
      }

      this.logger.info(
        { id, url: updatedRss.url, fn: 'update' },
        'RSS feed updated successfully',
      );
      return updatedRss;
    } catch (err: unknown) {
      if ((err as Error).message.includes('UNIQUE')) {
        this.logger.warn({ err, id, data, fn: 'update' }, 'Duplicate URL');
        throw new RssServiceError(409, 'Duplicate URL');
      }

      this.logger.error(
        { err, id, data, fn: 'update' },
        'Failed to update RSS feed',
      );
      throw new RssServiceError(500, 'Update failed');
    }
  }

  delete(id: number): number {
    const changes = this.db
      .delete(rssFeedsTable)
      .where(eq(rssFeedsTable.id, id))
      .run().changes;

    if (changes > 0) {
      this.logger.info({ id, fn: 'delete' }, 'Deleted RSS feed');
    } else {
      this.logger.warn(
        { id, fn: 'delete' },
        'Attempted to delete non-existing RSS feed',
      );
    }

    return changes;
  }
}
