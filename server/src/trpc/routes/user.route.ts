import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  userParamsSchema,
  userCreateSchema,
  userUpdateSchema,
} from '../../validations/schemas/users.schemas.js';
import { publicProcedure, t, userService } from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';

export const userRouter = t.router({
  getAll: protectedProcedure.query(() => {
    return userService.getAll();
  }),

  create: publicProcedure.input(userCreateSchema).mutation(({ input }) => {
    return userService.create(input);
  }),

  update: protectedProcedure
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

  delete: protectedProcedure.input(userParamsSchema).mutation(({ input }) => {
    const deletedCount = userService.delete(input.id);
    if (deletedCount === 0) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }
    return { success: true };
  }),
});
