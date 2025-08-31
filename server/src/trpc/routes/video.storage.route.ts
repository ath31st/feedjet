import {
  videoStorageService,
  t,
  publicProcedure,
  eventBus,
} from '../../container.js';
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

  listFiles: protectedProcedure.query(() => {
    const videos = videoStorageService.listVideosWithMetadata();
    return videos;
  }),

  listActiveVideos: publicProcedure.query(() => {
    const videos = videoStorageService.listActiveVideos();
    return videos;
  }),

  updateIsActive: protectedProcedure
    .input(updateVideoMetadataSchema)
    .mutation(async ({ input }) => {
      const result = await videoStorageService.update(
        input.filename,
        input.isActive,
      );
      const activeVideos = videoStorageService.listActiveVideos();
      eventBus.emit('video', activeVideos);

      return result;
    }),

  deleteFile: protectedProcedure
    .input(fileDeleteParamsSchema)
    .mutation(async ({ input }) => {
      await videoStorageService.delete(input.filename);
      const activeVideos = videoStorageService.listActiveVideos();
      eventBus.emit('video', activeVideos);

      return { ok: true };
    }),

  getDiskUsage: protectedProcedure.query(async () => {
    return videoStorageService.getDiskUsage();
  }),
});
