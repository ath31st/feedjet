import type {
  TickerConfig,
  NewTickerConfig,
  UpdateTickerConfig,
} from '@shared/types/ticker.config.js';
import type { DbType } from '../container.js';
import { createServiceLogger } from '../utils/pino.logger.js';
import { tickerConfigTable } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';
import { TickerConfigServiceError } from '../errors/ticker.config.error.js';
import { TICKER_DEFAULTS } from '../config/ticker.config.js';

export class TickerConfigService {
  private readonly db: DbType;
  private readonly logger = createServiceLogger('tickerConfigService');

  constructor(db: DbType) {
    this.db = db;
  }

  getAll(): TickerConfig[] {
    return this.db.select().from(tickerConfigTable).all();
  }

  findByKioskId(kioskId: number): TickerConfig | null {
    const ticker = this.db
      .select()
      .from(tickerConfigTable)
      .where(eq(tickerConfigTable.kioskId, kioskId))
      .get();

    return ticker || null;
  }

  get(kioskId: number): TickerConfig | null {
    const ticker = this.db
      .select()
      .from(tickerConfigTable)
      .where(eq(tickerConfigTable.kioskId, kioskId))
      .get();

    return ticker || null;
  }

  getDefault(): TickerConfig {
    return TICKER_DEFAULTS;
  }

  create(kioskId: number, data: NewTickerConfig): TickerConfig {
    this.logger.debug({ data, fn: 'create' }, 'Creating ticker config');

    try {
      const saved = this.db
        .insert(tickerConfigTable)
        .values({ ...data, kioskId })
        .returning()
        .get();

      this.logger.info({ fn: 'create' }, 'Ticker config created successfully');
      return saved;
    } catch (err: unknown) {
      this.logger.error(
        { err, data, fn: 'create' },
        'Failed to create ticker config',
      );
      throw new TickerConfigServiceError(500, 'Failed to create ticker config');
    }
  }

  update(kioskId: number, data: Partial<UpdateTickerConfig>): TickerConfig {
    this.logger.debug(
      { kioskId, data, fn: 'update' },
      'Updating ticker config',
    );

    try {
      const updated = this.db
        .update(tickerConfigTable)
        .set(data)
        .where(eq(tickerConfigTable.kioskId, kioskId))
        .returning()
        .get();

      if (!updated) {
        this.logger.warn(
          { kioskId, fn: 'update' },
          'Ticker config not found for update',
        );
        throw new TickerConfigServiceError(404, 'Config not found');
      }

      this.logger.info(
        { kioskId, updated, fn: 'update' },
        'Ticker config updated successfully',
      );
      return updated;
    } catch (err: unknown) {
      this.logger.error(
        { err, data, fn: 'update' },
        'Failed to update ticker config',
      );
      throw new TickerConfigServiceError(500, 'Failed to update ticker config');
    }
  }

  delete(kioskId: number): boolean {
    this.logger.debug({ kioskId, fn: 'delete' }, 'Deleting ticker config');

    try {
      const result = this.db
        .delete(tickerConfigTable)
        .where(eq(tickerConfigTable.kioskId, kioskId))
        .run();

      this.logger.info(
        { kioskId, fn: 'delete' },
        'Ticker config deleted successfully',
      );
      return result.changes > 0;
    } catch (err: unknown) {
      this.logger.error(
        { err, kioskId, fn: 'delete' },
        'Failed to delete ticker config',
      );
      throw new TickerConfigServiceError(500, 'Failed to delete ticker config');
    }
  }

  upsert(data: TickerConfig): TickerConfig {
    this.logger.debug({ data, fn: 'upsert' }, 'Upserting ticker config');

    try {
      const saved = this.db
        .insert(tickerConfigTable)
        .values(data)
        .onConflictDoUpdate({
          target: tickerConfigTable.kioskId,
          set: {
            text: data.text,
            isActive: data.isActive,
            speedPxPerSec: data.speedPxPerSec,
            direction: data.direction,
            fontScale: data.fontScale,
            textColor: data.textColor,
            backgroundColor: data.backgroundColor,
            backgroundOpacity: data.backgroundOpacity,
            height: data.height,
            positionY: data.positionY,
            paddingX: data.paddingX,
            isLooped: data.isLooped,
            updatedAt: sql`(unixepoch())`,
          },
        })
        .returning()
        .get();

      this.logger.info({ fn: 'upsert' }, 'Ticker config upserted successfully');
      return saved;
    } catch (err: unknown) {
      this.logger.error(
        { err, data, fn: 'upsert' },
        'Failed to upsert ticker config',
      );
      throw new TickerConfigServiceError(500, 'Failed to upsert ticker config');
    }
  }
}
