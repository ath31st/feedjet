import { brandingConfigTable } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import type { DbType } from '../container.js';
import type {
  BrandingConfig,
  BrandingConfigUpdate,
} from '@shared/types/branding.config.js';
import { BrandingConfigError } from '../errors/branding.config.error.js';
import { createServiceLogger } from '../utils/pino.logger.js';

export class BrandingConfigService {
  private readonly db: DbType;
  private readonly logger = createServiceLogger('brandingConfigService');

  constructor(db: DbType) {
    this.db = db;
  }

  // TODO: после ввода организаций, нужно будет сделать выборку по организации
  findCurrentConfig(): BrandingConfig | null {
    try {
      return (
        this.db
          .select()
          .from(brandingConfigTable)
          .orderBy(desc(brandingConfigTable.id))
          .limit(1)
          .get() ?? null
      );
    } catch (err) {
      this.logger.error(
        { err, fn: 'findCurrentConfig' },
        'Failed to find current branding config',
      );
      throw new BrandingConfigError(
        500,
        'Failed to find current branding config',
      );
    }
  }

  getConfigOrCreateDefault() {
    const config = this.findCurrentConfig();
    return config ?? this.createDefaultConfig();
  }

  private createDefaultConfig(): BrandingConfig {
    this.logger.debug(
      { fn: 'createDefaultConfig' },
      'Creating default branding config',
    );

    try {
      const defaultConfig = this.db
        .insert(brandingConfigTable)
        .values({})
        .returning()
        .get();

      this.logger.info(
        { defaultConfig, fn: 'createDefaultConfig' },
        'Default branding config created',
      );

      return defaultConfig;
    } catch (err) {
      this.logger.error(
        { err, fn: 'createDefaultConfig' },
        'Failed to create default branding config',
      );
      throw new BrandingConfigError(
        500,
        'Failed to create default branding config',
      );
    }
  }

  update(id: number, data: Partial<BrandingConfigUpdate>): BrandingConfig {
    this.logger.debug({ id, data, fn: 'update' }, 'Updating branding config');

    try {
      const updatedConfig = this.db
        .update(brandingConfigTable)
        .set(data)
        .where(eq(brandingConfigTable.id, id))
        .returning()
        .get();

      if (!updatedConfig) {
        this.logger.warn(
          { id, data, fn: 'update' },
          'Branding config not found for update',
        );
        throw new BrandingConfigError(404, 'Config not found');
      }

      this.logger.info(
        { id, updatedConfig, fn: 'update' },
        'Branding config updated successfully',
      );

      return updatedConfig;
    } catch (err) {
      this.logger.error(
        { err, id, data, fn: 'update' },
        'Failed to update branding config',
      );
      throw new BrandingConfigError(500, 'Failed to update branding config');
    }
  }

  getConfig(id: number): BrandingConfig {
    try {
      const config = this.db
        .select()
        .from(brandingConfigTable)
        .where(eq(brandingConfigTable.id, id))
        .get();

      if (!config) {
        this.logger.warn({ id, fn: 'getConfig' }, 'Branding config not found');
        throw new BrandingConfigError(404, 'Config not found');
      }

      return config;
    } catch (err) {
      this.logger.error(
        { err, id, fn: 'getConfig' },
        'Failed to fetch branding config',
      );
      throw new BrandingConfigError(500, 'Failed to fetch branding config');
    }
  }
}
