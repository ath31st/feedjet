import { uiConfigTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { DbType } from '../container.js';
import type { UiConfig, UpdateUiConfig } from '@shared/types/ui.config.js';
import { themes, widgetTypes } from '@shared/types/ui.config.js';

export class UiConfigService {
  private readonly configId: number = 1;
  private readonly db: DbType;

  constructor(db: DbType) {
    this.db = db;
  }

  update(data: Partial<UpdateUiConfig>): UiConfig | undefined {
    return this.db
      .update(uiConfigTable)
      .set(data)
      .where(eq(uiConfigTable.id, this.configId))
      .returning()
      .get();
  }

  getConfig(): UiConfig | undefined {
    return this.db
      .select()
      .from(uiConfigTable)
      .where(eq(uiConfigTable.id, this.configId))
      .get();
  }

  getAllowedWidgets() {
    return widgetTypes;
  }

  getAllowedThemes() {
    return themes;
  }
}
