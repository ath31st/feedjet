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
import { kioskIdInputSchema } from '../../validations/schemas/kiosk.schemas.js';
import {
  batchUpdateVideoOrderSchema,
  updateVideoMetadataSchema,
} from '../../validations/schemas/video.schemas.js';

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

  listFiles: protectedProcedure.input(kioskIdInputSchema).query(({ input }) => {
    const videos = videoStorageService.listAdminVideos(input.kioskId);
    return videos;
  }),

  listActiveVideos: publicProcedure
    .input(kioskIdInputSchema)
    .query(({ input }) => {
      const videos = videoStorageService.listActiveVideosByKiosk(input.kioskId);
      return videos;
    }),

  updateVideoOrder: protectedProcedure
    .input(batchUpdateVideoOrderSchema)
    .mutation(async ({ input }) => {
      const result = await videoStorageService.updateVideoOrderBatch(
        input.kioskId,
        input.updates,
      );
      const activeVideos = videoStorageService.listActiveVideosByKiosk(
        input.kioskId,
      );
      eventBus.emit(`video:${input.kioskId}`, activeVideos);

      return result;
    }),

  updateIsActive: protectedProcedure
    .input(updateVideoMetadataSchema)
    .mutation(async ({ input }) => {
      const result = await videoStorageService.update(
        input.filename,
        input.kioskId,
        input.isActive,
      );
      const activeVideos = videoStorageService.listActiveVideosByKiosk(
        input.kioskId,
      );
      eventBus.emit(`video:${input.kioskId}`, activeVideos);

      return result;
    }),

  deleteFile: protectedProcedure
    .input(fileDeleteParamsSchema.and(kioskIdInputSchema))
    .mutation(async ({ input }) => {
      await videoStorageService.delete(input.filename);
      const activeVideos = videoStorageService.listActiveVideosByKiosk(
        input.kioskId,
      );
      eventBus.emit(`video:${input.kioskId}`, activeVideos);

      return { ok: true };
    }),

  getDiskUsage: protectedProcedure.query(async () => {
    return videoStorageService.getDiskUsage();
  }),
});
