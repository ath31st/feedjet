import { z } from 'zod';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import type { FastifyInstance } from 'fastify';
import {
  userCreateSchema,
  userParamsSchema,
  userResponseSchema,
  usersResponseSchema,
  userUpdateSchema,
} from '../../validations/schemas/users.schemas.js';

export async function userRoutes(app: FastifyInstance) {
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: { response: { 200: usersResponseSchema } },
    handler: async (_req) => {
      return app.userService.getAll();
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/:id',
    schema: {
      params: userParamsSchema,
      response: {
        200: userResponseSchema,
        404: z.object({ error: z.string() }),
      },
    },
    handler: async (req, reply) => {
      const user = app.userService.getById(req.params.id);
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }
      return user;
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/',
    schema: {
      body: userCreateSchema,
      response: { 201: userResponseSchema },
    },
    handler: async (req, reply) => {
      const user = app.userService.create(req.body);
      return reply.code(201).send(user);
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PUT',
    url: '/:id',
    schema: {
      params: userParamsSchema,
      body: userUpdateSchema,
      response: {
        200: userResponseSchema,
        404: z.object({ error: z.string() }),
      },
    },
    handler: async (req, reply) => {
      const user = app.userService.update(req.params.id, req.body);
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }
      return user;
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      params: userParamsSchema,
      response: {
        204: z.null(),
        404: z.object({ error: z.string() }),
      },
    },
    handler: async (req, reply) => {
      const success = app.userService.delete(req.params.id);
      if (!success) {
        return reply.code(404).send({ error: 'User not found' });
      }
      return reply.code(204).send();
    },
  });
}
