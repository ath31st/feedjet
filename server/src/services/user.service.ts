// src/services/user.service.ts
import { usersTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { DbType } from '../container.js';

export class UserService {
  constructor(private readonly db: DbType) {}

  getAll() {
    return this.db.select().from(usersTable).all();
  }

  getById(id: number) {
    return this.db.select().from(usersTable).where(eq(usersTable.id, id)).get();
  }

  create(data: { login: string; password: string }) {
    return this.db.insert(usersTable).values(data).returning().get();
  }

  update(id: number, data: Partial<{ login: string; password: string }>) {
    return this.db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning()
      .get();
  }

  delete(id: number) {
    return this.db.delete(usersTable).where(eq(usersTable.id, id)).run();
  }
}
