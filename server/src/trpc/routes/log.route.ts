import { t, logService } from '../../container.js';
import { handleServiceCall } from '../error.handler.js';
import { protectedProcedure } from '../../middleware/auth.js';
import { logInputSchema } from '../../validations/schemas/log.schemas.js';

export const logRouter = t.router({
  getLogFiles: protectedProcedure.query(() => {
    return handleServiceCall(() => {
      return logService.getLogFiles();
    });
  }),

  getLogPage: protectedProcedure.input(logInputSchema).query(({ input }) => {
    return handleServiceCall(() => {
      return logService.getLogPageByFile(
        input.file,
        input.page,
        input.pageSize,
        input.filter,
      );
    });
  }),
});
