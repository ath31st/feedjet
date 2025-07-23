import { t, authService } from '../../container.js';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure } from '../../middleware/auth.js';

export const authRouter = t.router({
  login: t.procedure
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
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return { user: ctx.user };
  }),
});
