import type { BirthdayWidgetTransform } from '@shared/types/birthday.widget.transform.js';
import type { DbType } from '../container.js';
import { createServiceLogger } from '../utils/pino.logger.js';
import { birthdayWidgetTransformTable } from '../db/schema.js';
import { BirthdayWidgetTransformError } from '../errors/birthday.widget.transform.error.js';
import { sql, eq } from 'drizzle-orm';

export class BirthdayWidgetTransformService {
  private readonly db: DbType;
  private readonly logger = createServiceLogger(
    'birthdayWidgetTransformService',
  );
  /*
   * Default values for the birthday widget transform
   *
   * month: 0 (1-12)
   * posX: 50 (0-100%)
   * posY: 50 (0-100%)
   * fontScale: 100 (50-300%)
   * rotateZ: 0 (-180-180)
   * rotateX: 0 (-90-90)
   * rotateY: 0 (-90-90)
   * lineGap: 100 (50-300%)
   */
  private defaultTransform: BirthdayWidgetTransform = {
    month: 0,
    posX: 50,
    posY: 50,
    fontScale: 100,
    rotateZ: 0,
    rotateX: 0,
    rotateY: 0,
    lineGap: 100,
  };

  constructor(db: DbType) {
    this.db = db;
  }

  getAll(): BirthdayWidgetTransform[] {
    return this.db.select().from(birthdayWidgetTransformTable).all();
  }

  getByMonth(month: number): BirthdayWidgetTransform {
    const bwt = this.db
      .select()
      .from(birthdayWidgetTransformTable)
      .where(eq(birthdayWidgetTransformTable.month, month))
      .get();

    return bwt ?? { ...this.defaultTransform, month };
  }

  upsert(data: BirthdayWidgetTransform): BirthdayWidgetTransform {
    this.logger.debug(
      { data, fn: 'upsert' },
      'Upserting birthday widget transform',
    );

    try {
      const saved = this.db
        .insert(birthdayWidgetTransformTable)
        .values(data)
        .onConflictDoUpdate({
          target: birthdayWidgetTransformTable.month,
          set: {
            posX: data.posX,
            posY: data.posY,
            fontScale: data.fontScale,
            rotateZ: data.rotateZ,
            rotateX: data.rotateX,
            rotateY: data.rotateY,
            lineGap: data.lineGap,
            updatedAt: sql`(unixepoch())`,
          },
        })
        .returning()
        .get();

      this.logger.info({ fn: 'upsert' }, 'Birthday widget transform upserted');
      return saved;
    } catch (err: unknown) {
      this.logger.error(
        { err, data, fn: 'upsert' },
        'Failed to upsert birthday widget transform',
      );
      throw new BirthdayWidgetTransformError(
        500,
        'Failed to upsert birthday widget transform',
      );
    }
  }
}
