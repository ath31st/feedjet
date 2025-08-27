import { videoStorageService, t } from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';
import {
  fileDeleteParamsSchema,
  fileParamsSchema,
} from '../../validations/schemas/file.storage.validation.js';
import { updateVideoMetadataSchema } from '../../validations/schemas/video.validation.js';

export const videoStorageRouter = t.router({
  uploadFile: protectedProcedure
    .input(fileParamsSchema)
    .mutation(async ({ input }) => {
      const file = input.get('file') as File;
      const filename = input.get('filename') as string;

      const { path, savedFileName } = await videoStorageService.upload(
        file,
        filename,
      );

      return { ok: true, path, filename: savedFileName };
    }),

  listFiles: protectedProcedure.query(async () => {
    const videos = await videoStorageService.listVideosWithMetadata();
    return videos;
  }),

  updateIsActive: protectedProcedure
    .input(updateVideoMetadataSchema)
    .mutation(async ({ input }) => {
      return videoStorageService.update(input.filename, input.isActive);
    }),

  deleteFile: protectedProcedure
    .input(fileDeleteParamsSchema)
    .mutation(async ({ input }) => {
      videoStorageService.delete(input.filename);

      return { ok: true };
    }),

  getDiskUsage: protectedProcedure.query(async () => {
    return videoStorageService.getDiskUsage();
  }),
});
