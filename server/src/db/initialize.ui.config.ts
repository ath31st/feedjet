import { eq } from 'drizzle-orm';
import type { DbType } from '../container.js';
import { uiConfigTable } from './schema.js';
import Logger from '../utils/logger.js';

export function ensureUiConfig(db: DbType) {
  const existingConfig = db
    .select()
    .from(uiConfigTable)
    .where(eq(uiConfigTable.id, 1))
    .all();

  if (existingConfig.length === 0) {
    db.insert(uiConfigTable)
      .values({
        id: 1,
        activeWidget: 'feed',
        rotatingWidgets: ['feed', 'schedule'],
        autoSwitchIntervalMs: 30000,
        theme: 'dark',
      })
      .run();
    Logger.info('UI config initialized');
  }
}
