import type { BirthdayWidgetTransform } from '@shared/types/birthday.widget.transform.js';
import type { DbType } from '../container.js';
import { createServiceLogger } from '../utils/pino.logger.js';
import { birthdayWidgetTransformTable } from '../db/schema.js';
import { BirthdayWidgetTransformError } from '../errors/birthday.widget.transform.error.js';
import { sql } from 'drizzle-orm';

export class BirthdayWidgetTransformService {
  private readonly db: DbType;
  private readonly logger = createServiceLogger(
    'birthdayWidgetTransformService',
  );

  constructor(db: DbType) {
    this.db = db;
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
