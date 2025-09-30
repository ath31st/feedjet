import type { Kiosk, NewKiosk } from '@shared/types/kiosk.js';
import type { DbType } from '../container.js';
import type { FeedConfigService } from './feed.config.service.js';
import type { UiConfigService } from './ui.config.service.js';
import { kiosksTable } from '../db/schema.js';
import { KioskError } from '../errors/kiosk.error.js';
import Logger from '../utils/logger.js';
import { eq, sql } from 'drizzle-orm';

export class KioskService {
  private readonly db: DbType;
  private readonly uiConfigService: UiConfigService;
  private readonly feedConfigService: FeedConfigService;

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
    return this.db.transaction(() => {
      this.validateUniqueConstraints(data);

      try {
        const kiosk = this.db
          .insert(kiosksTable)
          .values(data)
          .returning()
          .get();

        this.uiConfigService.createDefaultConfig(kiosk.id);
        this.feedConfigService.createDefaultConfig(kiosk.id);

        return kiosk;
      } catch (error: unknown) {
        if (error instanceof KioskError) {
          throw error;
        }
        Logger.error(error);
        throw new KioskError(500, `Failed to create kiosk with configs`);
      }
    });
  }

  private validateUniqueConstraints(data: NewKiosk): void {
    const existingByName = this.db
      .select()
      .from(kiosksTable)
      .where(sql`lower(${kiosksTable.name}) = lower(${data.name})`)
      .get();

    if (existingByName) {
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
      throw new KioskError(404, 'Kiosk not found');
    }

    return kiosk;
  }

  getAll(): Kiosk[] {
    return this.db.select().from(kiosksTable).all();
  }

  delete(kioskId: number): void {
    this.db.delete(kiosksTable).where(eq(kiosksTable.id, kioskId)).run();
  }

  deleteBySlug(slug: string): void {
    this.db.delete(kiosksTable).where(eq(kiosksTable.slug, slug)).run();
  }

  ensureDefaultKiosk(): void {
    const kiosk = this.db
      .select()
      .from(kiosksTable)
      .where(eq(kiosksTable.slug, 'default'))
      .get();

    if (!kiosk) {
      this.create({ name: 'Default', slug: 'default' });
      Logger.log('Created default kiosk');
    }
  }
}
