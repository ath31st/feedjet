import { t, authService } from '../../container.js';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

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
        maxAge: 1000 * 60 * 60 * 24, // 1 день
      });

      return { success: true };
    }),
});
