import { usersTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { DbType } from '../container.js';
import type {
  NewUser,
  UserWithPassword,
  UserUpdate,
  User,
} from '@shared/types/user.js';
import bcrypt from 'bcrypt';
import { UserServiceError } from '../errors/user.error.js';
import Logger from '../utils/logger.js';
import { userMapper } from '../mappers/user.mapper.js';

export class UserService {
  private readonly saltRounds = 10;
  private readonly db: DbType;

  constructor(db: DbType) {
    this.db = db;
  }

  getAll(): User[] {
    return this.db
      .select()
      .from(usersTable)
      .all()
      .map((u) => userMapper.toDTO(u));
  }

  findByLogin(login: string): UserWithPassword | undefined {
    return this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.login, login))
      .get();
  }

  findById(id: number): UserWithPassword | undefined {
    return this.db.select().from(usersTable).where(eq(usersTable.id, id)).get();
  }

  create(data: NewUser): User {
    data.password = this.hashPassword(data.password);

    try {
      const user = this.db.insert(usersTable).values(data).returning().get();
      return userMapper.toDTO(user);
    } catch (err: unknown) {
      if ((err as Error).message.includes('UNIQUE')) {
        throw new UserServiceError(409, 'User with same login already exists');
      }

      Logger.error(err);
      throw new UserServiceError(500, 'Failed to create user');
    }
  }

  update(id: number, data: Partial<UserUpdate>): User | undefined {
    if (data.password) {
      data.password = this.hashPassword(data.password);
    }

    try {
      const updatedUser = this.db
        .update(usersTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(usersTable.id, id))
        .returning()
        .get();

      if (!updatedUser) {
        throw new UserServiceError(404, 'User not found');
      }

      return userMapper.toDTO(updatedUser);
    } catch (err: unknown) {
      if ((err as Error).message.includes('UNIQUE')) {
        throw new UserServiceError(409, 'User with same login already exists');
      }

      Logger.error(err);
      throw new UserServiceError(500, 'Failed to create user');
    }
  }

  delete(id: number): number {
    const count = this.db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .run().changes;

    if (count === 0) {
      throw new UserServiceError(404, 'User not found');
    }

    return count;
  }

  private hashPassword(password: string): string {
    return bcrypt.hashSync(password, this.saltRounds);
  }
}
