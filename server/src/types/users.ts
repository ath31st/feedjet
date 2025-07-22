export interface UserInput {
  login: string;
  password: string;
}

export interface UserUpdateInput {
  login?: string;
  password?: string;
}

export interface IdParams {
  Params: {
    id: string;
  };
}

export interface UserCreateBody {
  Body: UserInput;
}

export interface UserUpdateBody {
  Body: UserUpdateInput;
}
