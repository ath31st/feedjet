import { eq } from 'drizzle-orm';
import type { DbType } from '../container.js';
import { feedConfigTable } from './schema.js';
import Logger from '../utils/logger.js';

export function ensureFeedConfig(db: DbType) {
  const existingConfig = db
    .select()
    .from(feedConfigTable)
    .where(eq(feedConfigTable.id, 1))
    .all();

  if (existingConfig.length === 0) {
    db.insert(feedConfigTable)
      .values({
        id: 1,
        visibleCellCount: 6,
        carouselSize: 6,
        carouselIntervalMs: 30000,
      })
      .run();
    Logger.info('Feed config initialized');
  }
}
