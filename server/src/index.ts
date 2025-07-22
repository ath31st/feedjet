import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import container from './container.js';
import { routes } from './trpc/index.js';

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: '*',
});

await app.register(routes);
await app.register(container);

app.get('/rss-test', async (_req, _res) => {
  const data = await app.rssParser.parse('https://24gadget.ru/rss.xml');
  return data;
});

await app.listen({ port: 3000 });
