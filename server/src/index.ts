import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { db, rssParser } from './container.js';
import { usersTable } from './db/schema.js';

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: '*',
});

app.decorate('db', db);
app.decorate('rssParser', rssParser);

app.get('/test', async (_req, _reply) => {
  const rows = await app.db.select().from(usersTable).all();
  return rows;
});

app.get('/rss-test', async (_req, _res) => {
  const data = await app.rssParser.parse('https://24gadget.ru/rss.xml');
  return data;
});

await app.listen({ port: 3000 });
