import { t, kioskWorkScheduleService } from '../../container.js';
import { handleServiceCall } from '../error.handler.js';
import { kioskIdInputSchema } from '../../validations/schemas/kiosk.schemas.js';
import { publicProcedure, protectedProcedure } from '../../middleware/auth.js';
import { kioskWorkScheduleUpsertInputSchema } from '../../validations/schemas/kiosk.work.schedule.schemas.js';

export const kioskWorkScheduleRouter = t.router({
  getByKioskId: publicProcedure.input(kioskIdInputSchema).query(({ input }) => {
    return handleServiceCall(() => {
      return kioskWorkScheduleService.getByKioskId(input.kioskId);
    });
  }),

  upsertDay: protectedProcedure
    .input(kioskWorkScheduleUpsertInputSchema)
    .mutation(({ input }) =>
      handleServiceCall(() => {
        const kioskWorkSchedule = kioskWorkScheduleService.upsertDay(
          input.kioskId,
          input.data,
        );
        return kioskWorkSchedule;
      }),
    ),
});
