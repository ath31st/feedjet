import { usersTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { DbType } from '../container.js';
import type { NewUser, User } from '@shared/types/user.js';
import bcrypt from 'bcrypt';

export class UserService {
  private readonly saltRounds = 10;
  private readonly db: DbType;

  constructor(db: DbType) {
    this.db = db;
  }

  getAll(): User[] {
    return this.db.select().from(usersTable).all();
  }

  getByLogin(login: string): User | undefined {
    return this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.login, login))
      .get();
  }

  findById(id: number): User | undefined {
    return this.db.select().from(usersTable).where(eq(usersTable.id, id)).get();
  }

  create(data: NewUser): User {
    data.password = this.hashPassword(data.password);
    return this.db.insert(usersTable).values(data).returning().get();
  }

  update(id: number, data: Partial<User>): User | undefined {
    return this.db
      .update(usersTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(usersTable.id, id))
      .returning()
      .get();
  }

  delete(id: number): number {
    return this.db.delete(usersTable).where(eq(usersTable.id, id)).run()
      .changes;
  }

  private hashPassword(password: string): string {
    return bcrypt.hashSync(password, this.saltRounds);
  }
}
