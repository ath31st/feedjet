import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  userParamsSchema,
  userCreateSchema,
  userUpdateSchema,
} from '../../validations/schemas/users.schemas.js';
import { publicProcedure, t, userService } from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';
import { handleServiceCall } from '../error.handler.js';

export const userRouter = t.router({
  getAll: protectedProcedure.query(() => {
    return userService.getAll();
  }),

  create: publicProcedure
    .input(userCreateSchema)
    .mutation(({ input }) =>
      handleServiceCall(() => userService.create(input)),
    ),

  update: protectedProcedure
    .input(
      z.object({
        id: userParamsSchema.shape.id,
        data: userUpdateSchema,
      }),
    )
    .mutation(({ input }) =>
      handleServiceCall(() => userService.update(input.id, input.data)),
    ),

  delete: protectedProcedure.input(userParamsSchema).mutation(({ input }) => {
    const deletedCount = userService.delete(input.id);
    if (deletedCount === 0) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }
    return { success: true };
  }),
});
