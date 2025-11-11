import { uiConfigTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { DbType } from '../container.js';
import type { UiConfig, UpdateUiConfig } from '@shared/types/ui.config.js';
import { themes, widgetTypes } from '@shared/types/ui.config.js';
import { UiConfigError } from '../errors/ui.config.error.js';
import logger from '../utils/pino.logger.js';

export class UiConfigService {
  private readonly db: DbType;

  constructor(db: DbType) {
    this.db = db;
  }

  createDefaultConfig(kioskId: number): UiConfig {
    logger.debug({ kioskId }, 'Creating default ui config');

    try {
      const defaultConfig = this.db
        .insert(uiConfigTable)
        .values({
          kioskId,
          rotatingWidgets: ['feed', 'schedule'],
          autoSwitchIntervalMs: 60000,
          theme: 'dark',
        })
        .returning()
        .get();

      logger.info({ kioskId, defaultConfig }, 'Default ui config created');
      return defaultConfig;
    } catch (err) {
      logger.error({ err, kioskId }, 'Failed to create default ui config');
      throw new UiConfigError(500, 'Failed to create default ui config');
    }
  }

  update(kioskId: number, data: Partial<UpdateUiConfig>): UiConfig {
    logger.debug({ kioskId, data }, 'Updating ui config');

    try {
      const updatedConfig = this.db
        .update(uiConfigTable)
        .set(data)
        .where(eq(uiConfigTable.kioskId, kioskId))
        .returning()
        .get();

      if (!updatedConfig) {
        logger.warn({ kioskId, data }, 'Ui config not found for update');
        throw new UiConfigError(404, 'Config not found');
      }

      logger.info({ kioskId, updatedConfig }, 'Ui config updated successfully');
      return updatedConfig;
    } catch (err) {
      logger.error({ err, data }, 'Failed to update ui config');
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
        logger.warn({ kioskId }, 'Ui config not found');
        throw new UiConfigError(404, 'Config not found');
      }

      return config;
    } catch (err) {
      logger.error({ err }, 'Failed to fetch ui config');
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
