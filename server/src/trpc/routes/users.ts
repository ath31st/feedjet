import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type {
  IdParams,
  UserCreateBody,
  UserUpdateBody,
} from '../../types/users.js';
import {
  usersResponseSchema,
  userResponseSchema,
  userInputSchema,
  userUpdateSchema,
} from '../../validations/schemas/users.schemas.js';

export async function userRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      schema: {
        description: 'Retrieve all users',
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
        description: 'Retrieve user by ID',
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
        description: 'Create a new user',
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
        description: 'Update user by ID',
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
        description: 'Delete user by ID',
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
