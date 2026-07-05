import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { userService, authService } from '../container.js';
import { userMapper } from '../mappers/user.mapper.js';

export async function createContext({ req, res }: CreateExpressContextOptions) {
  let user = null;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const payload = authService.validateAccessToken(token);

      user = userService.findById(payload.userId);
      if (user) {
        user = userMapper.toDTO(user);
      }
    } catch (_err) {}
  }

  // TODO: ленивый способ достать организацию по юзеру по необходимости
  // const getOrganization = async () => {
  //   if (!user?.organizationId) return null;
  //   const orgEntity = await organizationService.findById(user.organizationId);
  //   return orgEntity ? organizationMapper.toDTO(orgEntity) : null;
  // };

  // return { req, res, user, getOrganization };
  return { req, res, user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
