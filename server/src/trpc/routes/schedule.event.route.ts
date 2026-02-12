import { scheduleEventService, t } from '../../container.js';
import { protectedProcedure, publicProcedure } from '../../middleware/auth.js';
import {
  scheduleEventCreateSchema,
  scheduleEventFindByDateRangeSchema,
  scheduleEventFindByDateSchema,
  scheduleEventParamsSchema,
  scheduleEventUpdateSchema,
} from '../../validations/schemas/schedule.event.schemas.js';
import z from 'zod';
import { handleServiceCall } from '../error.handler.js';

export const scheduleEventRouter = t.router({
  findById: publicProcedure
    .input(scheduleEventParamsSchema)
    .query(({ input }) =>
      handleServiceCall(() => {
        return scheduleEventService.findById(input.id);
      }),
    ),

  findByDateRange: publicProcedure
    .input(scheduleEventFindByDateRangeSchema)
    .query(({ input }) =>
      handleServiceCall(() => {
        return scheduleEventService.findByDateRange(
          input.startDate,
          input.endDate,
        );
      }),
    ),

  findByDate: publicProcedure
    .input(scheduleEventFindByDateSchema)
    .query(({ input }) =>
      handleServiceCall(() => {
        return scheduleEventService.findByDate(input.date);
      }),
    ),

  create: protectedProcedure
    .input(scheduleEventCreateSchema)
    .mutation(({ input }) =>
      handleServiceCall(() => {
        return scheduleEventService.create(input);
      }),
    ),

  update: protectedProcedure
    .input(
      z.object({
        id: scheduleEventParamsSchema.shape.id,
        data: scheduleEventUpdateSchema,
      }),
    )
    .mutation(({ input }) =>
      handleServiceCall(() => {
        return scheduleEventService.update(input.id, input.data);
      }),
    ),

  delete: protectedProcedure
    .input(scheduleEventParamsSchema)
    .mutation(({ input }) =>
      handleServiceCall(() => {
        return scheduleEventService.delete(input.id);
      }),
    ),
});
