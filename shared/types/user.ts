export interface NewUser {
  login: string;
  password: string;
}

export interface User {
  id: number;
  login: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserUpdate {
  login?: string;
  password?: string;
}
