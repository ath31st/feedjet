import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { userService, authService } from '../container.js';

export async function createContext({ req, res }: CreateExpressContextOptions) {
  let user = null;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const payload = authService.validateAccessToken(token);
      user = userService.findById(payload.id);
    } catch (_err) {}
  }

  return { req, res, user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
