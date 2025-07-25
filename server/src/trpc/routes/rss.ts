import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  rssCreateSchema,
  rssParamsSchema,
  rssUpdateSchema,
} from '../../validations/schemas/rss.schemas.js';
import { t, rssService } from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';

export const rssRouter = t.router({
  getAll: protectedProcedure.query(() => {
    return rssService.getAll();
  }),

  getById: protectedProcedure.input(rssParamsSchema).query(({ input }) => {
    const rss = rssService.getById(input.id);
    if (!rss) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'RSS not found' });
    }
    return rss;
  }),

  create: protectedProcedure.input(rssCreateSchema).mutation(({ input }) => {
    return rssService.create(input);
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: rssParamsSchema.shape.id,
        data: rssUpdateSchema,
      }),
    )
    .mutation(({ input }) => {
      return rssService.update(input.id, input.data);
    }),

  delete: protectedProcedure.input(rssParamsSchema).mutation(({ input }) => {
    return rssService.delete(input.id);
  }),
});
