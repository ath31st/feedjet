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
import logger from '../utils/pino.logger.js';

export class BirthdayService {
  private readonly db: DbType;

  constructor(db: DbType) {
    this.db = db;
  }

  create(data: NewBirthday): Birthday {
    logger.debug({ data }, 'Creating birthday entry');

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
      logger.info({ birthday: result }, 'Birthday created successfully');
      return result;
    } catch (err: unknown) {
      logger.error({ err, data }, 'Failed to create birthday');
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
    logger.info({ count: data.length }, 'Purging and inserting birthdays');

    try {
      const deleted = this.purge();
      logger.debug({ deleted }, 'Purged old birthdays');

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
      logger.info(
        { insertedCount: result.length },
        'Birthdays inserted successfully',
      );
      return result;
    } catch (err: unknown) {
      logger.error(
        { err, dataCount: data.length },
        'Failed to insert birthdays',
      );
      throw new BirthdayError(500, 'Failed to insert birthdays');
    }
  }

  delete(id: number): number {
    logger.debug({ id }, 'Deleting birthday entry');

    const changes = this.db
      .delete(birthdaysTable)
      .where(eq(birthdaysTable.id, id))
      .run().changes;

    logger.info({ id, deleted: changes }, 'Birthday deleted');
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
