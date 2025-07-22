import type { DbType } from '../src/db/index.js';

declare module 'fastify' {
  interface FastifyInstance {
    db: DbType;
  }
}
