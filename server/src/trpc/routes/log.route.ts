import { t, logService } from '../../container.js';
import { handleServiceCall } from '../error.handler.js';
import { protectedProcedure } from '../../middleware/auth.js';
import {
  deleteLogFilesSchema,
  logFileSchema,
  logInputSchema,
} from '../../validations/schemas/log.schemas.js';

export const logRouter = t.router({
  getLogFiles: protectedProcedure.query(() => {
    return handleServiceCall(() => logService.getLogFiles());
  }),

  getLogSources: protectedProcedure.input(logFileSchema).query(({ input }) => {
    return handleServiceCall(() => logService.getLogSources(input.file));
  }),

  getLogPage: protectedProcedure.input(logInputSchema).query(({ input }) => {
    return handleServiceCall(() =>
      logService.getLogPageByFile(
        input.file,
        input.page,
        input.pageSize,
        input.filter,
      ),
    );
  }),

  downloadLogFile: protectedProcedure
    .input(logFileSchema)
    .query(({ input }) => {
      return handleServiceCall(() => logService.readLogFileContent(input.file));
    }),

  deleteLogFiles: protectedProcedure
    .input(deleteLogFilesSchema)
    .mutation(({ input }) => {
      return handleServiceCall(() =>
        logService.deleteLogFiles(input.daysToKeep),
      );
    }),
});
