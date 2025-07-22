export const userInputSchema = {
  type: 'object',
  required: ['login', 'password'],
  properties: {
    login: { type: 'string', minLength: 3 },
    password: { type: 'string', minLength: 4 },
  },
};

export const userUpdateSchema = {
  type: 'object',
  properties: {
    login: { type: 'string', minLength: 3 },
    password: { type: 'string', minLength: 4 },
  },
};

export const userResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    login: { type: 'string' },
    password: { type: 'string' },
  },
};

export const usersResponseSchema = {
  type: 'array',
  items: userResponseSchema,
};
