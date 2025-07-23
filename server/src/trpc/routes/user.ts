import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  userParamsSchema,
  userCreateSchema,
  userUpdateSchema,
} from '../../validations/schemas/users.schemas.js';
import { t, userService } from '../../container.js';

export const userRouter = t.router({
  getAll: t.procedure.query(() => {
    return userService.getAll();
  }),

  getById: t.procedure.input(userParamsSchema).query(({ input }) => {
    const user = userService.getById(input.id);
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }
    return user;
  }),

  create: t.procedure.input(userCreateSchema).mutation(({ input }) => {
    return userService.create(input);
  }),

  update: t.procedure
    .input(
      z.object({
        id: userParamsSchema.shape.id,
        data: userUpdateSchema,
      }),
    )
    .mutation(({ input }) => {
      const user = userService.update(input.id, input.data);
      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }
      return user;
    }),

  delete: t.procedure.input(userParamsSchema).mutation(({ input }) => {
    const deletedCount = userService.delete(input.id);
    if (deletedCount === 0) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }
    return { success: true };
  }),
});
