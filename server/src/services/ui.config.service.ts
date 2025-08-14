import { uiConfigTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { DbType } from '../container.js';
import type { UiConfig, UpdateUiConfig } from '@shared/types/ui.config.js';
import { themes, widgetTypes } from '@shared/types/ui.config.js';
import { UiConfigError } from '../errors/ui.config.error.js';
import Logger from '../utils/logger.js';

export class UiConfigService {
  private readonly configId: number = 1;
  private readonly db: DbType;

  constructor(db: DbType) {
    this.db = db;
  }

  update(data: Partial<UpdateUiConfig>): UiConfig {
    try {
      const updatedConfig = this.db
        .update(uiConfigTable)
        .set(data)
        .where(eq(uiConfigTable.id, this.configId))
        .returning()
        .get();

      if (!updatedConfig) {
        throw new UiConfigError(404, 'Config not found');
      }

      return updatedConfig;
    } catch (err) {
      Logger.error(err);
      throw new UiConfigError(500, 'Failed to update ui config');
    }
  }

  getConfig(): UiConfig {
    try {
      const config = this.db
        .select()
        .from(uiConfigTable)
        .where(eq(uiConfigTable.id, this.configId))
        .get();

      if (!config) {
        throw new UiConfigError(404, 'Config not found');
      }

      return config;
    } catch (err) {
      Logger.error(err);
      throw new UiConfigError(500, 'Failed to fetch ui config');
    }
  }

  getAllowedWidgets() {
    return widgetTypes;
  }

  getAllowedThemes() {
    return themes;
  }
}
