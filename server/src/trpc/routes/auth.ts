import { t, authService, publicProcedure } from '../../container.js';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure } from '../../middleware/auth.js';

export const authRouter = t.router({
  login: publicProcedure
    .input(
      z.object({
        login: z.string(),
        password: z.string(),
      }),
    )

    .mutation(async ({ input, ctx }) => {
      const user = authService.login(input.login, input.password);
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials',
        });
      }

      ctx.res.cookie('userId', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: Number(process.env.COOKIE_MAX_AGE),
      });

      return { success: true };
    }),

  me: protectedProcedure.query(({ ctx }) => {
    return { user: ctx.user };
  }),
});
