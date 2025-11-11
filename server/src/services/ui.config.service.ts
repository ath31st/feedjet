import { uiConfigTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { DbType } from '../container.js';
import type { UiConfig, UpdateUiConfig } from '@shared/types/ui.config.js';
import { themes, widgetTypes } from '@shared/types/ui.config.js';
import { UiConfigError } from '../errors/ui.config.error.js';
import { createServiceLogger } from '../utils/pino.logger.js';

export class UiConfigService {
  private readonly db: DbType;
  private readonly logger = createServiceLogger('uiConfigService');

  constructor(db: DbType) {
    this.db = db;
  }

  createDefaultConfig(kioskId: number): UiConfig {
    this.logger.debug(
      { kioskId, fn: 'createDefaultConfig' },
      'Creating default ui config',
    );

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

      this.logger.info(
        { kioskId, defaultConfig, fn: 'createDefaultConfig' },
        'Default ui config created',
      );
      return defaultConfig;
    } catch (err) {
      this.logger.error(
        { err, kioskId, fn: 'createDefaultConfig' },
        'Failed to create default ui config',
      );
      throw new UiConfigError(500, 'Failed to create default ui config');
    }
  }

  update(kioskId: number, data: Partial<UpdateUiConfig>): UiConfig {
    this.logger.debug({ kioskId, data, fn: 'update' }, 'Updating ui config');

    try {
      const updatedConfig = this.db
        .update(uiConfigTable)
        .set(data)
        .where(eq(uiConfigTable.kioskId, kioskId))
        .returning()
        .get();

      if (!updatedConfig) {
        this.logger.warn(
          { kioskId, data, fn: 'update' },
          'Ui config not found for update',
        );
        throw new UiConfigError(404, 'Config not found');
      }

      this.logger.info(
        { kioskId, updatedConfig, fn: 'update' },
        'Ui config updated successfully',
      );
      return updatedConfig;
    } catch (err) {
      this.logger.error(
        { err, data, fn: 'update' },
        'Failed to update ui config',
      );
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
        this.logger.warn({ kioskId, fn: 'getConfig' }, 'Ui config not found');
        throw new UiConfigError(404, 'Config not found');
      }

      return config;
    } catch (err) {
      this.logger.error(
        { err, kioskId, fn: 'getConfig' },
        'Failed to fetch ui config',
      );
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
