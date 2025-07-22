import type { FastifyInstance } from 'fastify';
import { userRoutes } from './users.js';

export async function routes(app: FastifyInstance) {
  app.register(userRoutes, { prefix: '/api/users' });
  //app.register(configs, { prefix: '/api/configs' });
}
