import {
  t,
  mediaFolderService,
  imageStorageService,
  videoStorageService,
  pdfStorageService,
} from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';
import {
  createMediaFolderSchema,
  renameMediaFolderSchema,
  deleteMediaFolderSchema,
  listMediaSchema,
  assignImageFolderSchema,
  assignVideoFolderSchema,
  assignPdfFolderSchema,
  moveMediaBatchSchema,
  deleteMediaBatchSchema,
} from '../../validations/schemas/media.folder.schemas.js';

export const mediaFolderRouter = t.router({
  getTree: protectedProcedure.query(() => {
    return mediaFolderService.getTree();
  }),

  create: protectedProcedure
    .input(createMediaFolderSchema)
    .mutation(({ input }) => {
      return mediaFolderService.create(input.name, input.parentId);
    }),

  rename: protectedProcedure
    .input(renameMediaFolderSchema)
    .mutation(({ input }) => {
      return mediaFolderService.rename(input.id, input.name);
    }),

  delete: protectedProcedure
    .input(deleteMediaFolderSchema)
    .mutation(({ input }) => {
      mediaFolderService.delete(input.id);
      return { success: true };
    }),

  listMedia: protectedProcedure.input(listMediaSchema).query(({ input }) => {
    return mediaFolderService.listAllMedia(input.folderId);
  }),

  assignImageFolder: protectedProcedure
    .input(assignImageFolderSchema)
    .mutation(({ input }) => {
      mediaFolderService.assignImageToFolder(input.imageId, input.folderId);
      return { success: true };
    }),

  assignVideoFolder: protectedProcedure
    .input(assignVideoFolderSchema)
    .mutation(({ input }) => {
      mediaFolderService.assignVideoToFolder(input.videoId, input.folderId);
      return { success: true };
    }),

  assignPdfFolder: protectedProcedure
    .input(assignPdfFolderSchema)
    .mutation(({ input }) => {
      mediaFolderService.assignPdfToFolder(input.pdfId, input.folderId);
      return { success: true };
    }),

  moveMediaBatch: protectedProcedure
    .input(moveMediaBatchSchema)
    .mutation(({ input }) => {
      mediaFolderService.moveMediaBatch(
        input.folderId,
        input.imageIds,
        input.videoIds,
        input.pdfIds,
      );
      return {
        success: true,
        movedCount:
          input.imageIds.length + input.videoIds.length + input.pdfIds.length,
      };
    }),

  deleteMediaBatch: protectedProcedure
    .input(deleteMediaBatchSchema)
    .mutation(async ({ input }) => {
      const { imageFileNames, videoFileNames, pdfFileNames } =
        mediaFolderService.getFileNamesByIds(
          input.imageIds,
          input.videoIds,
          input.pdfIds,
        );

      for (const fileName of imageFileNames) {
        await imageStorageService.delete(fileName);
      }
      for (const fileName of videoFileNames) {
        await videoStorageService.delete(fileName);
      }
      for (const fileName of pdfFileNames) {
        await pdfStorageService.delete(fileName);
      }

      return {
        success: true,
        deletedCount:
          imageFileNames.length + videoFileNames.length + pdfFileNames.length,
      };
    }),

  stats: protectedProcedure.query(() => {
    return {
      imageCount: mediaFolderService.countAllImages(),
      videoCount: mediaFolderService.countAllVideos(),
      pdfCount: mediaFolderService.countAllPdfs(),
    };
  }),
});
