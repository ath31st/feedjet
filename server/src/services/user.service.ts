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
import { userMapper } from '../mappers/user.mapper.js';
import logger from '../utils/pino.logger.js';

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
    logger.debug({ data }, 'Creating user');

    data.password = this.hashPassword(data.password);

    try {
      const user = this.db.insert(usersTable).values(data).returning().get();
      const dto = userMapper.toDTO(user);

      logger.info({ id: user.id, login: user.login }, 'Created user');
      return dto;
    } catch (err: unknown) {
      if ((err as Error).message.includes('UNIQUE')) {
        logger.warn({ err, data }, 'User with same login already exists');
        throw new UserServiceError(409, 'User with same login already exists');
      }

      logger.error({ err, data }, 'Failed to create user');
      throw new UserServiceError(500, 'Failed to create user');
    }
  }

  update(id: number, data: Partial<UserUpdate>): User {
    logger.debug({ id, data }, 'Updating user');

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
        logger.warn({ id, data }, 'User not found for update');
        throw new UserServiceError(404, 'User not found');
      }

      logger.info(
        { id, login: updatedUser.login },
        'User updated successfully',
      );
      return userMapper.toDTO(updatedUser);
    } catch (err: unknown) {
      if ((err as Error).message.includes('UNIQUE')) {
        logger.warn({ err, data }, 'User with same login already exists');
        throw new UserServiceError(409, 'User with same login already exists');
      }

      logger.error({ err, data }, 'Failed to update user');
      throw new UserServiceError(500, 'Failed to create user');
    }
  }

  delete(id: number): number {
    try {
      const count = this.db
        .delete(usersTable)
        .where(eq(usersTable.id, id))
        .run().changes;

      if (count === 0) {
        logger.warn({ id }, 'Attempted to delete non-existing user');
        throw new UserServiceError(404, 'User not found');
      }

      logger.info({ id }, 'Deleted user');
      return count;
    } catch (err) {
      logger.error({ err }, 'Failed to delete user');
      throw new UserServiceError(500, 'Failed to delete user');
    }
  }

  private hashPassword(password: string): string {
    return bcrypt.hashSync(password, this.saltRounds);
  }
}
