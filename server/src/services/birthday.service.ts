import type { DbType } from '../container.js';
import { birthdaysTable } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';
import type {
  BirthdayEncrypted,
  Birthday,
  NewBirthday,
} from '@shared/types/birthdays.js';
import { encrypt } from '../utils/crypto.js';
import { BirthdayError } from '../errors/birthday.error.js';
import { birthdayMapper } from '../mappers/birthday.mapper.js';
import { createServiceLogger } from '../utils/pino.logger.js';

export class BirthdayService {
  private readonly db: DbType;
  private readonly logger = createServiceLogger('birthdayService');

  constructor(db: DbType) {
    this.db = db;
  }

  create(data: NewBirthday): Birthday {
    this.logger.debug({ data, fn: 'create' }, 'Creating birthday entry');

    try {
      const inserted = this.db
        .insert(birthdaysTable)
        .values({
          fullNameEnc: encrypt(data.fullName),
          departmentEnc: data.department ? encrypt(data.department) : null,
          birthDate: data.birthDate,
        })
        .returning()
        .get() as unknown as BirthdayEncrypted;

      const result = birthdayMapper.mapEncToDec(inserted);
      this.logger.info(
        { birthday: result, fn: 'create' },
        'Birthday created successfully',
      );
      return result;
    } catch (err: unknown) {
      this.logger.error(
        { err, data, fn: 'create' },
        'Failed to create birthday',
      );
      throw new BirthdayError(500, 'Failed to create birthday');
    }
  }

  getAll(): Birthday[] {
    const encBirthdays = this.db.select().from(birthdaysTable).all();
    return encBirthdays
      .map(birthdayMapper.mapEncToDec)
      .sort(this.birthdayComparator);
  }

  getByMonth(month: number): Birthday[] {
    const encBirthdays = this.db
      .select()
      .from(birthdaysTable)
      .where(
        sql`CAST(strftime('%m', ${birthdaysTable.birthDate}, 'unixepoch', 'localtime') AS INTEGER) = ${month}`,
      )
      .all();

    return encBirthdays
      .map(birthdayMapper.mapEncToDec)
      .sort(this.birthdayComparator);
  }

  getByDate(date: Date): Birthday[] {
    const encBirthdays = this.db
      .select()
      .from(birthdaysTable)
      .where(eq(birthdaysTable.birthDate, date))
      .all();

    return encBirthdays
      .map(birthdayMapper.mapEncToDec)
      .sort(this.birthdayComparator);
  }

  purge(): number {
    return this.db.delete(birthdaysTable).run().changes;
  }

  purgeAndInsert(data: NewBirthday[]): Birthday[] {
    this.logger.info(
      { count: data.length, fn: 'purgeAndInsert' },
      'Purging and inserting birthdays',
    );

    try {
      const deleted = this.purge();
      this.logger.debug(
        { deleted, fn: 'purgeAndInsert' },
        'Purged old birthdays',
      );

      const inserted = data.map((b) => {
        return this.db
          .insert(birthdaysTable)
          .values({
            fullNameEnc: encrypt(b.fullName),
            departmentEnc: b.department ? encrypt(b.department) : null,
            birthDate: b.birthDate,
          })
          .returning()
          .get() as unknown as BirthdayEncrypted;
      });

      const result = inserted.map(birthdayMapper.mapEncToDec);
      this.logger.info(
        { insertedCount: result.length, fn: 'purgeAndInsert' },
        'Birthdays inserted successfully',
      );
      return result;
    } catch (err: unknown) {
      this.logger.error(
        { err, dataCount: data.length, fn: 'purgeAndInsert' },
        'Failed to insert birthdays',
      );
      throw new BirthdayError(500, 'Failed to insert birthdays');
    }
  }

  delete(id: number): number {
    this.logger.debug({ id, fn: 'delete' }, 'Deleting birthday entry');

    const changes = this.db
      .delete(birthdaysTable)
      .where(eq(birthdaysTable.id, id))
      .run().changes;

    this.logger.info(
      { id, deleted: changes, fn: 'delete' },
      'Birthday deleted',
    );
    return changes;
  }

  birthdayComparator(a: Birthday, b: Birthday): number {
    const aMonth = a.birthDate.getMonth();
    const bMonth = b.birthDate.getMonth();
    if (aMonth !== bMonth) return aMonth - bMonth;

    const aDay = a.birthDate.getDate();
    const bDay = b.birthDate.getDate();
    if (aDay !== bDay) return aDay - bDay;

    return a.fullName.localeCompare(b.fullName);
  }
}
