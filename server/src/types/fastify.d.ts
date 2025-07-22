import { DrizzleD1Database } from 'drizzle-orm/d1';

declare module 'fastify' {
  interface FastifyInstance {
    db: ReturnType<typeof import('../src/db/index.js')['db']>;
  }
}
