import { publicProcedure, scheduleEventService, t } from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';
import { TRPCError } from '@trpc/server';
import {
  scheduleEventCreateSchema,
  scheduleEventFindByDateRangeSchema,
  scheduleEventFindByDateSchema,
  scheduleEventParamsSchema,
  scheduleEventUpdateSchema,
} from '../../validations/schemas/schedule.event.schemas.js';
import z from 'zod';

export const scheduleEventRouter = t.router({
  findById: publicProcedure
    .input(scheduleEventParamsSchema)
    .query(({ input }) => {
      const event = scheduleEventService.findById(input.id);
      if (!event) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' });
      }
      return event;
    }),

  findByDateRange: publicProcedure
    .input(scheduleEventFindByDateRangeSchema)
    .query(({ input }) => {
      return scheduleEventService.findByDateRange(
        input.startDate,
        input.endDate,
      );
    }),

  findByDate: publicProcedure
    .input(scheduleEventFindByDateSchema)
    .query(({ input }) => {
      return scheduleEventService.findByDate(input.date);
    }),

  create: protectedProcedure
    .input(scheduleEventCreateSchema)
    .mutation(({ input }) => {
      return scheduleEventService.create(input);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: scheduleEventParamsSchema.shape.id,
        data: scheduleEventUpdateSchema,
      }),
    )
    .mutation(({ input }) => {
      const event = scheduleEventService.update(input.id, input.data);
      if (!event) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' });
      }
      return event;
    }),

  delete: protectedProcedure
    .input(scheduleEventParamsSchema)
    .mutation(({ input }) => {
      return scheduleEventService.delete(input.id);
    }),
});
