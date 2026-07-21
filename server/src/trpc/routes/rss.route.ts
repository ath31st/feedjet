import { z } from 'zod';
import {
  rssCreateSchema,
  rssParamsSchema,
  rssUpdateSchema,
} from '../../validations/schemas/rss.schemas.js';
import { t, rssService } from '../../container.js';
import { refetchIfClientsOnline } from '../../cron/rss.cron.js';
import { protectedProcedure } from '../../middleware/auth.js';
import { handleServiceCall } from '../error.handler.js';

export const rssRouter = t.router({
  getAll: protectedProcedure.query(() => {
    return rssService.getAll();
  }),

  getActive: protectedProcedure.query(() => {
    return rssService.getActive();
  }),

  findById: protectedProcedure.input(rssParamsSchema).query(({ input }) =>
    handleServiceCall(() => {
      return rssService.findById(input.id);
    }),
  ),

  create: protectedProcedure
    .input(rssCreateSchema)
    .mutation(({ input }) =>
      handleServiceCall(() => {
        const created = rssService.create(input);
        refetchIfClientsOnline();
        return created;
      }),
    ),

  update: protectedProcedure
    .input(
      z.object({
        id: rssParamsSchema.shape.id,
        data: rssUpdateSchema,
      }),
    )
    .mutation(({ input }) =>
      handleServiceCall(() => {
        const updated = rssService.update(input.id, input.data);
        refetchIfClientsOnline();
        return updated;
      }),
    ),

  delete: protectedProcedure.input(rssParamsSchema).mutation(({ input }) =>
    handleServiceCall(() => {
      const deleted = rssService.delete(input.id);
      refetchIfClientsOnline();
      return deleted;
    }),
  ),
});
