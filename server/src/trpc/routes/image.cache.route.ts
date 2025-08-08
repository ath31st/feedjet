import { publicProcedure, t, imageCacheService } from '../../container.js';
import { TRPCError } from '@trpc/server';
import { imageCacheParamsSchema } from '../../validations/schemas/image.cache.schemas.js';

export const imageCacheRouter = t.router({
  get: publicProcedure
    .input(imageCacheParamsSchema)
    .query(async ({ input }) => {
      try {
        const { fileName } = await imageCacheService.process(
          input.url,
          input.w ?? 1920,
        );
        return `/cache/${fileName}`;
      } catch (_) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to process image',
        });
      }
    }),
});
