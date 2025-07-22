import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

interface UserInput {
  login: string;
  password: string;
}

interface UserUpdateInput {
  login?: string;
  password?: string;
}

const userInputSchema = {
  type: 'object',
  required: ['login', 'password'],
  properties: {
    login: { type: 'string', minLength: 3 },
    password: { type: 'string', minLength: 4 },
  },
};

const userUpdateSchema = {
  type: 'object',
  properties: {
    login: { type: 'string', minLength: 3 },
    password: { type: 'string', minLength: 4 },
  },
};

const userResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    login: { type: 'string' },
    password: { type: 'string' },
  },
};

const usersResponseSchema = {
  type: 'array',
  items: userResponseSchema,
};

interface IdParams {
  Params: {
    id: string;
  };
}

interface UserCreateBody {
  Body: UserInput;
}

interface UserUpdateBody {
  Body: UserUpdateInput;
}

export async function userRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      schema: {
        description: 'Получить список всех пользователей',
        tags: ['users'],
        response: { 200: usersResponseSchema },
      },
    },
    async () => {
      return app.userService.getAll();
    },
  );

  app.get(
    '/:id',
    {
      schema: {
        description: 'Получить пользователя по ID',
        tags: ['users'],
        params: { type: 'object', properties: { id: { type: 'string' } } },
        response: {
          200: userResponseSchema,
          404: { type: 'object', properties: { error: { type: 'string' } } },
        },
      },
    },
    async (req: FastifyRequest<IdParams>, reply: FastifyReply) => {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return reply.code(400).send({ error: 'Invalid ID' });
      }
      const user = app.userService.getById(id);
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }
      return user;
    },
  );

  app.post(
    '/',
    {
      schema: {
        description: 'Создать нового пользователя',
        tags: ['users'],
        body: userInputSchema,
        response: { 201: userResponseSchema },
      },
    },
    async (req: FastifyRequest<UserCreateBody>, reply: FastifyReply) => {
      const { login, password } = req.body;
      const user = app.userService.create({ login, password });
      return reply.code(201).send(user);
    },
  );

  app.put(
    '/:id',
    {
      schema: {
        description: 'Обновить пользователя по ID',
        tags: ['users'],
        params: { type: 'object', properties: { id: { type: 'string' } } },
        body: userUpdateSchema,
        response: {
          200: userResponseSchema,
          404: { type: 'object', properties: { error: { type: 'string' } } },
        },
      },
    },
    async (
      req: FastifyRequest<IdParams & UserUpdateBody>,
      reply: FastifyReply,
    ) => {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return reply.code(400).send({ error: 'Invalid ID' });
      }
      const data = req.body;
      const user = app.userService.update(id, data);
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }
      return user;
    },
  );

  app.delete(
    '/:id',
    {
      schema: {
        description: 'Удалить пользователя по ID',
        tags: ['users'],
        params: { type: 'object', properties: { id: { type: 'string' } } },
        response: {
          204: { type: 'null' },
          404: { type: 'object', properties: { error: { type: 'string' } } },
        },
      },
    },
    async (req: FastifyRequest<IdParams>, reply: FastifyReply) => {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return reply.code(400).send({ error: 'Invalid ID' });
      }
      const success = app.userService.delete(id);
      if (!success) {
        return reply.code(404).send({ error: 'User not found' });
      }
      return reply.code(204).send();
    },
  );
}
