import { usersTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { DbType } from '../container.js';
import type { NewUser, User } from '../types/user.js';

export class UserService {
  constructor(private readonly db: DbType) {}

  getAll(): User[] {
    return this.db.select().from(usersTable).all();
  }

  getById(id: number): User | undefined {
    return this.db.select().from(usersTable).where(eq(usersTable.id, id)).get();
  }

  create(data: NewUser): User {
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
}
