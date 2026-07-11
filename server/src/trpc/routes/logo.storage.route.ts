import { t, logoStorageService } from '../../container.js';
import { protectedProcedure, publicProcedure } from '../../middleware/auth.js';
import {
  fileDeleteParamsSchema,
  fileParamsSchema,
} from '../../validations/schemas/file.storage.validation.js';

export const logoStorageRouter = t.router({
  getLogo: publicProcedure.query(async () => {
    return logoStorageService.findCurrentLogo();
  }),

  uploadLogo: protectedProcedure
    .input(fileParamsSchema)
    .mutation(async ({ input }) => {
      const file = input.get('file') as File;
      const filename = input.get('filename') as string;

      const { path, savedFileName } = await logoStorageService.replace(
        file,
        filename,
      );

      return { ok: true, path, filename: savedFileName };
    }),

  deleteLogo: protectedProcedure
    .input(fileDeleteParamsSchema)
    .mutation(async ({ input }) => {
      await logoStorageService.delete(input.filename);
      return { ok: true };
    }),
});
