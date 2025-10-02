import { uiConfigTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { DbType } from '../container.js';
import type { UiConfig, UpdateUiConfig } from '@shared/types/ui.config.js';
import { themes, widgetTypes } from '@shared/types/ui.config.js';
import { UiConfigError } from '../errors/ui.config.error.js';
import Logger from '../utils/logger.js';

export class UiConfigService {
  private readonly db: DbType;

  constructor(db: DbType) {
    this.db = db;
  }

  createDefaultConfig(kioskId: number): UiConfig {
    try {
      return this.db
        .insert(uiConfigTable)
        .values({
          kioskId,
          rotatingWidgets: ['feed', 'schedule'],
          autoSwitchIntervalMs: 60000,
          theme: 'dark',
        })
        .returning()
        .get();
    } catch (err) {
      Logger.error(err);
      throw new UiConfigError(500, 'Failed to create default ui config');
    }
  }

  update(kioskId: number, data: Partial<UpdateUiConfig>): UiConfig {
    try {
      const updatedConfig = this.db
        .update(uiConfigTable)
        .set(data)
        .where(eq(uiConfigTable.kioskId, kioskId))
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

  getConfig(kioskId: number): UiConfig {
    try {
      const config = this.db
        .select()
        .from(uiConfigTable)
        .where(eq(uiConfigTable.kioskId, kioskId))
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
