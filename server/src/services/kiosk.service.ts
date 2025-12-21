import type { Kiosk, NewKiosk, UpdateKiosk } from '@shared/types/kiosk.js';
import type { DbType } from '../container.js';
import type { FeedConfigService } from './feed.config.service.js';
import type { UiConfigService } from './ui.config.service.js';
import { kioskIntegrationsTable, kiosksTable } from '../db/schema.js';
import { KioskError } from '../errors/kiosk.error.js';
import { eq, sql } from 'drizzle-orm';
import { createServiceLogger } from '../utils/pino.logger.js';
import type { Integration } from '@shared/types/integration.js';
import { integrationMapper } from '../mappers/integration.mapper.js';

export class KioskService {
  private readonly kioskLimit = 8;
  private readonly db: DbType;
  private readonly uiConfigService: UiConfigService;
  private readonly feedConfigService: FeedConfigService;
  private readonly logger = createServiceLogger('kioskService');

  constructor(
    db: DbType,
    uiConfigService: UiConfigService,
    feedConfigService: FeedConfigService,
  ) {
    this.db = db;
    this.uiConfigService = uiConfigService;
    this.feedConfigService = feedConfigService;
  }

  create(data: NewKiosk): Kiosk {
    this.logger.debug({ data, fn: 'create' }, 'Creating kiosk with configs');

    return this.db.transaction(() => {
      this.checkKiosksLimit();
      this.validateUniqueName(data.name);
      this.validateUniqueSlug(data.slug);

      try {
        const kiosk = this.db
          .insert(kiosksTable)
          .values(data)
          .returning()
          .get();

        this.uiConfigService.createDefaultConfig(kiosk.id);
        this.feedConfigService.createDefaultConfig(kiosk.id);

        this.logger.info(
          { kiosk, fn: 'create' },
          'Kiosk created with default configs',
        );
        return kiosk;
      } catch (error: unknown) {
        if (error instanceof KioskError) {
          throw error;
        }
        this.logger.error(
          { error, data, fn: 'create' },
          'Failed to create kiosk with configs',
        );
        throw new KioskError(500, `Failed to create kiosk with configs`);
      }
    });
  }

  private checkKiosksLimit(): void {
    const kiosksCount = this.getAll().length;

    if (kiosksCount >= this.kioskLimit) {
      this.logger.warn(
        { kiosksCount, fn: 'checkKiosksLimit' },
        'Kiosks limit reached',
      );
      throw new KioskError(400, 'Kiosks limit reached');
    }
  }

  private validateUniqueName(name: string): void {
    const existingByName = this.db
      .select()
      .from(kiosksTable)
      .where(sql`lower(${kiosksTable.name}) = lower(${name})`)
      .get();

    if (existingByName) {
      this.logger.warn(
        { name, fn: 'validateUniqueName' },
        'Kiosk name already exists',
      );
      throw new KioskError(409, `Kiosk with name '${name}' already exists`);
    }
  }

  private validateUniqueSlug(slug: string): void {
    const existingBySlug = this.db
      .select()
      .from(kiosksTable)
      .where(eq(kiosksTable.slug, slug))
      .get();

    if (existingBySlug) {
      this.logger.warn(
        { slug, fn: 'validateUniqueSlug' },
        'Kiosk slug already exists',
      );
      throw new KioskError(409, `Kiosk with slug '${slug}' already exists`);
    }
  }

  getBySlug(slug: string): Kiosk {
    const kiosk = this.db
      .select()
      .from(kiosksTable)
      .where(eq(kiosksTable.slug, slug))
      .get();

    if (!kiosk) {
      this.logger.warn({ slug, fn: 'getBySlug' }, 'Kiosk not found');
      throw new KioskError(404, 'Kiosk not found');
    }

    return kiosk;
  }

  getAll(): Kiosk[] {
    return this.db
      .select()
      .from(kiosksTable)
      .orderBy(kiosksTable.name, kiosksTable.id)
      .all();
  }

  getActive(): Kiosk[] {
    return this.db
      .select()
      .from(kiosksTable)
      .where(eq(kiosksTable.isActive, true))
      .orderBy(kiosksTable.name, kiosksTable.id)
      .all();
  }

  getActiveWithIntegration(): Array<{
    kiosk: Kiosk;
    integration: Integration;
  }> {
    return this.db
      .select({
        kiosk: kiosksTable,
        integration: kioskIntegrationsTable,
      })
      .from(kiosksTable)
      .innerJoin(
        kioskIntegrationsTable,
        eq(kioskIntegrationsTable.kioskId, kiosksTable.id),
      )
      .where(eq(kiosksTable.isActive, true))
      .orderBy(kiosksTable.name, kiosksTable.id)
      .all()
      .map((result) => ({
        kiosk: result.kiosk,
        integration: integrationMapper.fromEntity(result.integration),
      }));
  }

  update(kioskId: number, data: UpdateKiosk): Kiosk {
    this.logger.debug({ kioskId, data, fn: 'update' }, 'Updating kiosk');

    if (Object.keys(data).length === 0) {
      throw new KioskError(400, 'No data to update');
    }

    const existing = this.db
      .select()
      .from(kiosksTable)
      .where(eq(kiosksTable.id, kioskId))
      .get();

    if (!existing) {
      throw new KioskError(404, 'Kiosk not found');
    }

    if (data.name && data.name !== existing.name) {
      this.validateUniqueName(data.name);
    }

    try {
      const updated = this.db
        .update(kiosksTable)
        .set({
          ...data,
        })
        .where(eq(kiosksTable.id, kioskId))
        .returning()
        .get();

      this.logger.info({ kioskId, data, fn: 'update' }, 'Kiosk updated');

      return updated;
    } catch (error: unknown) {
      this.logger.error(
        { error, kioskId, data, fn: 'update' },
        'Failed to update kiosk',
      );
      throw new KioskError(500, 'Failed to update kiosk');
    }
  }

  delete(kioskId: number): void {
    this.db.delete(kiosksTable).where(eq(kiosksTable.id, kioskId)).run();
    this.logger.info({ kioskId, fn: 'delete' }, 'Kiosk deleted');
  }

  deleteBySlug(slug: string): void {
    this.db.delete(kiosksTable).where(eq(kiosksTable.slug, slug)).run();
    this.logger.info({ slug, fn: 'deleteBySlug' }, 'Kiosk deleted');
  }

  ensureDefaultKiosk(): void {
    const kiosk = this.db
      .select()
      .from(kiosksTable)
      .where(eq(kiosksTable.slug, 'default'))
      .get();

    if (!kiosk) {
      this.create({ name: 'Default', slug: 'default' });
    }
  }
}
