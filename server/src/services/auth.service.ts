import type { User } from '@shared/types/user.js';
import type { UserService } from './user.service.js';
import bcrypt from 'bcrypt';
import { userMapper } from '../mappers/user.mapper.js';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import Logger from '../utils/logger.js';
import { AuthError } from '../errors/auth.error.js';

export class AuthService {
  private readonly userService: UserService;
  private readonly jwtSecret = process.env.JWT_SECRET || 'secret';
  private readonly jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';

  constructor(userService: UserService) {
    this.userService = userService;
  }

  login(login: string, password: string): { token: string; user: User } | null {
    const user = this.userService.findByLogin(login);
    if (!user || !this.comparePassword(password, user.password)) {
      return null;
    }

    const dto = userMapper.toDTO(user);
    const token = this.generateToken(dto);

    return { token, user: dto };
  }

  validateAccessToken = (token: string): JwtPayload => {
    try {
      return jwt.verify(token, this.jwtSecret) as JwtPayload;
    } catch (error) {
      Logger.error('Invalid access token:', error);
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
