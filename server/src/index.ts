import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { db } from './db/index.js';
import { usersTable } from './db/schema.js';

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: '*',
});

app.decorate('db', db);

app.get('/test', async (_req, _reply) => {
  const rows = await app.db.select().from(usersTable).all();
  return rows;
});

await app.listen({ port: 3000 });
