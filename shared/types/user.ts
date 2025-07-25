export interface NewUser {
  login: string;
  password: string;
}

export type UserWithPassword = {
  id: number;
  login: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type User = Omit<UserWithPassword, 'password'>;

export interface UserUpdate {
  login?: string;
  password?: string;
}
