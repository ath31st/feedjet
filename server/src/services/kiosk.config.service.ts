import { kioskConfigTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { DbType } from '../container.js';
import type { KioskConfig, UpdateKioskConfig } from '../types/kiosk.config.js';
import { allowedThemes } from '../utils/constants/allowed.themes.js';

export class KioskConfigService {
  private readonly configId: number = 1;
  private readonly db: DbType;

  constructor(db: DbType) {
    this.db = db;
  }

  update(data: Partial<UpdateKioskConfig>): KioskConfig | undefined {
    return this.db
      .update(kioskConfigTable)
      .set(data)
      .where(eq(kioskConfigTable.id, this.configId))
      .returning()
      .get();
  }

  getMainConfig(): KioskConfig | undefined {
    return this.db
      .select()
      .from(kioskConfigTable)
      .where(eq(kioskConfigTable.id, this.configId))
      .get();
  }

  getAllowedThemes() {
    return allowedThemes;
  }
}
