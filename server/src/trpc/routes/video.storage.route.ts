import { videoStorageService, t } from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';
import {
  fileDeleteParamsSchema,
  fileParamsSchema,
} from '../../validations/schemas/file.storage.validation.js';

export const videoStorageRouter = t.router({
  uploadFile: protectedProcedure
    .input(fileParamsSchema)
    .mutation(async ({ input }) => {
      const file = input.get('file') as File;
      const filename = input.get('filename') as string;
      const folderIdRaw = input.get('folderId');
      const folderId =
        folderIdRaw && folderIdRaw !== '' ? Number(folderIdRaw) : null;

      const { path, savedFileName } = await videoStorageService.upload(
        file,
        filename,
        folderId,
      );

      return { ok: true, path, filename: savedFileName };
    }),

  getDiskUsage: protectedProcedure.query(async () => {
    return videoStorageService.getDiskUsage();
  }),

  deleteFileGlobal: protectedProcedure
    .input(fileDeleteParamsSchema)
    .mutation(async ({ input }) => {
      await videoStorageService.delete(input.filename);
      return { ok: true };
    }),
});
