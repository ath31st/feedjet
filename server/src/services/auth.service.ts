import type { UserService } from './user.service.js';
import bcrypt from 'bcrypt';

export class AuthService {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  login(login: string, password: string) {
    const user = this.userService.getByLogin(login);
    if (!user) {
      return false;
    }
    return this.comparePassword(password, user.password);
  }

  private comparePassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }
}
