import type { DbType } from '../container.js';
import { birthdaysTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type {
  BirthdayEncrypted,
  Birthday,
  NewBirthday,
} from '@shared/types/birthdays.js';
import Logger from '../utils/logger.js';
import { encrypt } from '../utils/crypto.js';
import { BirthdayError } from '../errors/birthday.error.js';
import { birthdayMapper } from '../mappers/birthday.mapper.js';

export class BirthdayService {
  private readonly db: DbType;

  constructor(db: DbType) {
    this.db = db;
  }

  getAll(): Birthday[] {
    const encBirthdays = this.db.select().from(birthdaysTable).all();
    return encBirthdays.map(birthdayMapper.mapEncToDec);
  }

  getByDate(date: Date): Birthday[] {
    const encBirthdays = this.db
      .select()
      .from(birthdaysTable)
      .where(eq(birthdaysTable.birthDate, date))
      .all();

    return encBirthdays.map(birthdayMapper.mapEncToDec);
  }

  purge(): number {
    return this.db.delete(birthdaysTable).run().changes;
  }

  purgeAndInsert(data: NewBirthday[]): Birthday[] {
    try {
      this.purge();

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

      return inserted.map(birthdayMapper.mapEncToDec);
    } catch (err: unknown) {
      Logger.error(err);
      throw new BirthdayError(500, 'Failed to insert birthdays');
    }
  }

  delete(id: number): number {
    return this.db.delete(birthdaysTable).where(eq(birthdaysTable.id, id)).run()
      .changes;
  }
}
