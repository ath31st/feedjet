export interface NewUser {
  login: string;
  password: string;
}

export interface User {
  id: number;
  login: string;
  password: string;
}

export interface UserUpdateInput {
  login?: string;
  password?: string;
}
