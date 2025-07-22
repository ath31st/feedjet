import type { RssParser } from '../services/parser.service.ts';
import type { DbType } from '../container.ts';
import type { UserService } from '../services/user.service.ts';

declare module 'fastify' {
  interface FastifyInstance {
    db: DbType;
    rssParser: RssParser;
    userService: UserService;
  }
}
