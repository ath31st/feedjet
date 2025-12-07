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
import {
  batchUpdateImageOrderSchema,
  updateIsActiveImageSchema,
} from '../../validations/schemas/image.schemas.js';
import { kioskIdInputSchema } from '../../validations/schemas/kiosk.schemas.js';

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

  listFiles: protectedProcedure.input(kioskIdInputSchema).query(({ input }) => {
    const images = imageStorageService.listAdminImages(input.kioskId);
    return images;
  }),

  listActiveImages: publicProcedure
    .input(kioskIdInputSchema)
    .query(({ input }) => {
      const images = imageStorageService.listActiveImagesByKiosk(input.kioskId);
      return images;
    }),

  updateImageOrder: protectedProcedure
    .input(batchUpdateImageOrderSchema)
    .mutation(async ({ input }) => {
      const result = await imageStorageService.updateImageOrderBatch(
        input.kioskId,
        input.updates,
      );
      const activeImages = imageStorageService.listActiveImagesByKiosk(
        input.kioskId,
      );
      eventBus.emit('image', activeImages);

      return result;
    }),

  updateIsActiveImage: protectedProcedure
    .input(updateIsActiveImageSchema)
    .mutation(async ({ input }) => {
      const result = await imageStorageService.update(
        input.fileName,
        input.kioskId,
        input.isActive,
      );
      const activeImages = imageStorageService.listActiveImagesByKiosk(
        input.kioskId,
      );
      eventBus.emit('image', activeImages);

      return result;
    }),

  deleteFile: protectedProcedure
    .input(fileDeleteParamsSchema.and(kioskIdInputSchema))
    .mutation(async ({ input }) => {
      await imageStorageService.delete(input.filename);
      const activeImages = imageStorageService.listActiveImagesByKiosk(
        input.kioskId,
      );
      eventBus.emit('image', activeImages);

      return { ok: true };
    }),

  getDiskUsage: protectedProcedure.query(async () => {
    return imageStorageService.getDiskUsage();
  }),
});
