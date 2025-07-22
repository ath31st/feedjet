import type { RssParser } from '../rss/parser.ts';
import type { DbType } from './container.ts';

declare module 'fastify' {
  interface FastifyInstance {
    db: DbType;
    rssParser: RssParser;
  }
}
