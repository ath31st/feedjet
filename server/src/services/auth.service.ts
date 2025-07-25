import type { User } from '@shared/types/user.js';
import type { UserService } from './user.service.js';
import bcrypt from 'bcrypt';

export class AuthService {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  login(login: string, password: string): User | null {
    const user = this.userService.findByLogin(login);
    if (!user || !this.comparePassword(password, user.password)) {
      return null;
    }
    return user;
  }

  private comparePassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }
}
