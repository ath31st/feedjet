import { eq } from 'drizzle-orm';
import type { DbType } from '../container.js';
import { kioskConfigTable } from './schema.js';
import Logger from '../utils/logger.js';

export function ensureKioskConfig(db: DbType) {
  const existingConfig = db
    .select()
    .from(kioskConfigTable)
    .where(eq(kioskConfigTable.id, 1))
    .all();

  if (existingConfig.length === 0) {
    db.insert(kioskConfigTable)
      .values({
        id: 1,
        cellsPerPage: 6,
        theme: 'dark',
      })
      .run();
    Logger.info('Kiosk config initialized');
  }
}
