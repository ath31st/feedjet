import { t, logService } from '../../container.js';
import { handleServiceCall } from '../error.handler.js';
import { protectedProcedure } from '../../middleware/auth.js';
import { logInputSchema } from '../../validations/schemas/log.schemas.js';

export const logRouter = t.router({
  getLogPage: protectedProcedure.input(logInputSchema).query(({ input }) => {
    return handleServiceCall(() => {
      return logService.getLogPage(input.cursor, input.filter, input.limit);
    });
  }),
});
