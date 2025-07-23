import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  rssCreateSchema,
  rssParamsSchema,
  rssUpdateSchema,
} from '../../validations/schemas/rss.schemas.js';
import { t, rssService } from '../../container.js';

export const rssRouter = t.router({
  getAll: t.procedure.query(() => {
    return rssService.getAll();
  }),

  getById: t.procedure.input(rssParamsSchema).query(({ input }) => {
    const rss = rssService.getById(input.id);
    if (!rss) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'RSS not found' });
    }
    return rss;
  }),

  create: t.procedure.input(rssCreateSchema).mutation(({ input }) => {
    return rssService.create(input);
  }),

  update: t.procedure
    .input(
      z.object({
        id: rssParamsSchema.shape.id,
        data: rssUpdateSchema,
      }),
    )
    .mutation(({ input }) => {
      return rssService.update(input.id, input.data);
    }),

  delete: t.procedure.input(rssParamsSchema).mutation(({ input }) => {
    return rssService.delete(input.id);
  }),
});
