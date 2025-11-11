import type { User } from '@shared/types/user.js';
import type { UserService } from './user.service.js';
import bcrypt from 'bcrypt';
import { userMapper } from '../mappers/user.mapper.js';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { AuthError } from '../errors/auth.error.js';
import logger from '../utils/pino.logger.js';

export class AuthService {
  private readonly userService: UserService;
  private readonly jwtSecret = process.env.JWT_SECRET || 'secret';
  private readonly jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';

  constructor(userService: UserService) {
    this.userService = userService;
  }

  login(login: string, password: string): { token: string; user: User } | null {
    const user = this.userService.findByLogin(login);

    if (!user) {
      logger.warn({ login }, 'Login attempt with unknown user');
      return null;
    }

    if (!this.comparePassword(password, user.password)) {
      logger.warn(
        { login, userId: user.id },
        'Login attempt failed: invalid password',
      );
      return null;
    }

    const dto = userMapper.toDTO(user);
    const token = this.generateToken(dto);

    logger.info({ login, userId: user.id }, 'User logged in successfully');

    return { token, user: dto };
  }

  validateAccessToken = (token: string): JwtPayload => {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as JwtPayload;
      logger.debug(
        { userId: payload.userId },
        'Access token validated successfully',
      );
      return payload;
    } catch (error) {
      logger.error(
        { error, token: `${token.slice(0, 8)}...` },
        'Invalid access token',
      );
      throw new AuthError('Invalid token');
    }
  };

  private comparePassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }

  private generateToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        login: user.login,
      },
      this.jwtSecret,
      {
        expiresIn: this.jwtExpiresIn,
      } as jwt.SignOptions,
    );
  }
}
