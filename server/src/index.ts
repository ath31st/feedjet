import Fastify from 'fastify';
import cors from '@fastify/cors';
import { db } from './db/index.js';
import { usersTable } from './db/schema.js';

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: '*',
});

fastify.decorate('db', db);

fastify.get('/test', async (req, reply) => {
  const rows = await fastify.db.select().from(usersTable).all();
  return rows;
});

await fastify.listen({ port: 3000 });
