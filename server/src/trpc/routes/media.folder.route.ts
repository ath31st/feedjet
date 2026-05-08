import { z } from 'zod';
import { t, mediaFolderService } from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';

export const mediaFolderRouter = t.router({
  getTree: protectedProcedure.query(() => {
    return mediaFolderService.getTree();
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), parentId: z.number().nullable() }))
    .mutation(({ input }) => {
      return mediaFolderService.create(input.name, input.parentId);
    }),

  rename: protectedProcedure
    .input(z.object({ id: z.number(), name: z.string().min(1) }))
    .mutation(({ input }) => {
      return mediaFolderService.rename(input.id, input.name);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      mediaFolderService.delete(input.id);
      return { success: true };
    }),

  listMedia: protectedProcedure
    .input(z.object({ folderId: z.number().nullable() }))
    .query(({ input }) => {
      return mediaFolderService.listAllMedia(input.folderId);
    }),

  assignImageFolder: protectedProcedure
    .input(z.object({ imageId: z.number(), folderId: z.number().nullable() }))
    .mutation(({ input }) => {
      mediaFolderService.assignImageToFolder(input.imageId, input.folderId);
      return { success: true };
    }),

  assignVideoFolder: protectedProcedure
    .input(z.object({ videoId: z.number(), folderId: z.number().nullable() }))
    .mutation(({ input }) => {
      mediaFolderService.assignVideoToFolder(input.videoId, input.folderId);
      return { success: true };
    }),

  stats: protectedProcedure.query(() => {
    return {
      imageCount: mediaFolderService.countAllImages(),
      videoCount: mediaFolderService.countAllVideos(),
    };
  }),
});
