import {
  t,
  publicProcedure,
  eventBus,
  imageStorageService,
} from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';
import {
  fileDeleteParamsSchema,
  fileParamsSchema,
} from '../../validations/schemas/file.storage.validation.js';
import { updateImageMetadataSchema } from '../../validations/schemas/image.schemas.js';

export const imageStorageRouter = t.router({
  uploadFile: protectedProcedure
    .input(fileParamsSchema)
    .mutation(async ({ input }) => {
      const file = input.get('file') as File;
      const filename = input.get('filename') as string;

      const { path, savedFileName } = await imageStorageService.upload(
        file,
        filename,
      );

      return { ok: true, path, filename: savedFileName };
    }),

  listFiles: protectedProcedure.query(() => {
    const images = imageStorageService.listImageMetadata();
    return images;
  }),

  listActiveImages: publicProcedure.query(() => {
    const images = imageStorageService.listActiveImages();
    return images;
  }),

  updateIsActive: protectedProcedure
    .input(updateImageMetadataSchema)
    .mutation(async ({ input }) => {
      const result = await imageStorageService.update(
        input.filename,
        input.isActive,
      );
      const activeImages = imageStorageService.listActiveImages();
      eventBus.emit('image', activeImages);

      return result;
    }),

  deleteFile: protectedProcedure
    .input(fileDeleteParamsSchema)
    .mutation(async ({ input }) => {
      await imageStorageService.delete(input.filename);
      const activeImages = imageStorageService.listActiveImages();
      eventBus.emit('image', activeImages);

      return { ok: true };
    }),

  getDiskUsage: protectedProcedure.query(async () => {
    return imageStorageService.getDiskUsage();
  }),
});
