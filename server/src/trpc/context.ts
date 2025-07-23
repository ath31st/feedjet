import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { userService } from '../container.js';

export async function createContext({ req, res }: CreateExpressContextOptions) {
  const userId = req.cookies?.userId;
  const user = userId ? userService.findById(userId) : null;

  return { req, res, user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
