import type { Kiosk, NewKiosk } from '@shared/types/kiosk.js';
import type { DbType } from '../container.js';
import type { FeedConfigService } from './feed.config.service.js';
import type { UiConfigService } from './ui.config.service.js';
import { kiosksTable } from '../db/schema.js';
import { KioskError } from '../errors/kiosk.error.js';
import { eq, sql } from 'drizzle-orm';
import { createServiceLogger } from '../utils/pino.logger.js';

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
      this.validateUniqueConstraints(data);

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

  private validateUniqueConstraints(data: NewKiosk): void {
    const existingByName = this.db
      .select()
      .from(kiosksTable)
      .where(sql`lower(${kiosksTable.name}) = lower(${data.name})`)
      .get();

    if (existingByName) {
      this.logger.warn(
        { name: data.name, fn: 'validateUniqueConstraints' },
        'Kiosk name already exists',
      );
      throw new KioskError(
        409,
        `Kiosk with name '${data.name}' already exists`,
      );
    }

    const existingBySlug = this.db
      .select()
      .from(kiosksTable)
      .where(eq(kiosksTable.slug, data.slug))
      .get();

    if (existingBySlug) {
      this.logger.warn(
        { slug: data.slug, fn: 'validateUniqueConstraints' },
        'Kiosk slug already exists',
      );
      throw new KioskError(
        409,
        `Kiosk with slug '${data.slug}' already exists`,
      );
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
    return this.db.select().from(kiosksTable).all();
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
