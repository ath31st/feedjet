import type { User, UserWithPassword } from '@shared/types/user.js';

export const userMapper = {
  toDTO(user: UserWithPassword): User {
    const { password: _, ...dto } = user;
    return dto;
  },
};
