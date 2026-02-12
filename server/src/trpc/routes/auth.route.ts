import { t, authService } from '../../container.js';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, publicProcedure } from '../../middleware/auth.js';

export const authRouter = t.router({
  login: publicProcedure
    .input(
      z.object({
        login: z.string(),
        password: z.string(),
      }),
    )

    .mutation(async ({ input }) => {
      const result = authService.login(input.login, input.password);
      if (!result) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials',
        });
      }

      return result;
    }),

  me: protectedProcedure.query(({ ctx }) => {
    return { user: ctx.user };
  }),
});
