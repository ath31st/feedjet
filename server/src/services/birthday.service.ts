import type { DbType } from '../container.js';
import { birthdaysTable } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';
import type {
  BirthdayEncrypted,
  Birthday,
  NewBirthday,
} from '@shared/types/birthdays.js';
import { encrypt } from '../utils/crypto.js';
import { createHash } from 'node:crypto';
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
          dedupKey: this.makeDedupKey(data.fullName, data.birthDate),
        })
        .onConflictDoNothing()
        .returning()
        .get() as unknown as BirthdayEncrypted;

      if (!inserted) {
        throw new BirthdayError(409, 'Birthday already exists');
      }

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
      if (err as BirthdayError) {
        throw err;
      }
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

  getByDayMonthRange(start: Date, end: Date): Birthday[] {
    const startStr = `${String(start.getMonth() + 1).padStart(2, '0')}-${String(
      start.getDate(),
    ).padStart(2, '0')}`;

    const endStr = `${String(end.getMonth() + 1).padStart(2, '0')}-${String(
      end.getDate(),
    ).padStart(2, '0')}`;

    const mdExpr = sql`strftime('%m-%d', ${birthdaysTable.birthDate}, 'unixepoch', 'localtime')`;

    const encBirthdays =
      startStr <= endStr
        ? this.db
            .select()
            .from(birthdaysTable)
            .where(sql`${mdExpr} >= ${startStr} AND ${mdExpr} <= ${endStr}`)
            .all()
        : this.db
            .select()
            .from(birthdaysTable)
            .where(sql`${mdExpr} >= ${startStr} OR ${mdExpr} <= ${endStr}`)
            .all();

    return encBirthdays
      .map(birthdayMapper.mapEncToDec)
      .sort(this.birthdayComparator);
  }

  purge(): number {
    return this.db.delete(birthdaysTable).run().changes;
  }

  purgeExceptLastDays(days: number): number {
    if (days <= 0) {
      return this.purge();
    }

    const today = sql`date('now', 'localtime')`;

    const lastBirthdayExpr = sql`
    CASE
      WHEN date(
        strftime('%Y', ${today}) || '-' ||
        strftime('%m-%d', ${birthdaysTable.birthDate}, 'unixepoch', 'localtime')
      ) > ${today}
      THEN date(
        strftime('%Y', ${today}, '-1 year') || '-' ||
        strftime('%m-%d', ${birthdaysTable.birthDate}, 'unixepoch', 'localtime')
      )
      ELSE date(
        strftime('%Y', ${today}) || '-' ||
        strftime('%m-%d', ${birthdaysTable.birthDate}, 'unixepoch', 'localtime')
      )
    END
  `;

    const deleted = this.db
      .delete(birthdaysTable)
      .where(
        sql`(
        julianday(${today}) - julianday(${lastBirthdayExpr})
      ) NOT BETWEEN 0 AND ${days}`,
      )
      .run().changes;

    this.logger.info(
      { days, deleted, fn: 'purgeExceptLastDays' },
      'Purged birthdays except those within last N days',
    );

    return deleted;
  }

  purgeAndInsert(data: NewBirthday[]): Birthday[] {
    this.logger.info(
      { count: data.length, fn: 'purgeAndInsert' },
      'Purging and inserting birthdays',
    );

    try {
      const deleted = this.purgeExceptLastDays(5);
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
            dedupKey: this.makeDedupKey(b.fullName, b.birthDate),
          })
          .onConflictDoNothing()
          .returning()
          .get() as unknown as BirthdayEncrypted;
      });

      const result = inserted.filter(Boolean).map(birthdayMapper.mapEncToDec);
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

  update(id: number, data: Partial<NewBirthday>): Birthday {
    this.logger.debug({ id, data, fn: 'update' }, 'Updating birthday entry');

    try {
      const updateData: Record<string, unknown> = {};

      if (data.fullName !== undefined) {
        updateData.fullNameEnc = encrypt(data.fullName);
      }

      if (data.department !== undefined) {
        updateData.departmentEnc = data.department
          ? encrypt(data.department)
          : null;
      }

      if (data.birthDate !== undefined) {
        updateData.birthDate = data.birthDate;
      }

      const updated = this.db
        .update(birthdaysTable)
        .set(updateData)
        .where(eq(birthdaysTable.id, id))
        .returning()
        .get() as unknown as BirthdayEncrypted;

      const result = birthdayMapper.mapEncToDec(updated);
      this.logger.info({ id, fn: 'update' }, 'Birthday updated successfully');
      return result;
    } catch (err: unknown) {
      this.logger.error(
        { err, id, data, fn: 'update' },
        'Failed to update birthday',
      );
      throw new BirthdayError(500, 'Failed to update birthday');
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

  private normalizeName(name: string): string {
    return name.trim().toLowerCase().replace(/\s+/g, ' ');
  }

  private monthDay(date: Date): string {
    return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate(),
    ).padStart(2, '0')}`;
  }

  private makeDedupKey(fullName: string, birthDate: Date): string {
    const base = `${this.normalizeName(fullName)}|${this.monthDay(birthDate)}`;
    return createHash('sha256').update(base).digest('hex');
  }

  private birthdayComparator(a: Birthday, b: Birthday): number {
    const aMonth = a.birthDate.getMonth();
    const bMonth = b.birthDate.getMonth();
    if (aMonth !== bMonth) return aMonth - bMonth;

    const aDay = a.birthDate.getDate();
    const bDay = b.birthDate.getDate();
    if (aDay !== bDay) return aDay - bDay;

    return a.fullName.localeCompare(b.fullName);
  }
}
