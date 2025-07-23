import type { DbType } from '../container.js';
import { rssFeedsTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { NewRssFeed, RssFeed, UpdateRssFeed } from '../types/rss.js';

export class RssService {
  constructor(private readonly db: DbType) {}

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
    return this.db.insert(rssFeedsTable).values(data).returning().get();
  }

  update(id: number, data: Partial<UpdateRssFeed>): RssFeed | undefined {
    return this.db
      .update(rssFeedsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(rssFeedsTable.id, id))
      .returning()
      .get();
  }

  delete(id: number): number {
    return this.db.delete(rssFeedsTable).where(eq(rssFeedsTable.id, id)).run()
      .changes;
  }
}
