import { z } from 'zod';

export const createMediaFolderSchema = z.object({
  name: z.string().min(1),
  parentId: z.number().nullable(),
});

export const renameMediaFolderSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
});

export const deleteMediaFolderSchema = z.object({
  id: z.number(),
});

export const listMediaSchema = z.object({
  folderId: z.number().nullable(),
});

export const assignImageFolderSchema = z.object({
  imageId: z.number(),
  folderId: z.number().nullable(),
});

export const assignVideoFolderSchema = z.object({
  videoId: z.number(),
  folderId: z.number().nullable(),
});

export const moveMediaBatchSchema = z.object({
  folderId: z.number().nullable(),
  imageIds: z.array(z.number()).default([]),
  videoIds: z.array(z.number()).default([]),
});

export const deleteMediaBatchSchema = z.object({
  imageIds: z.array(z.number()).default([]),
  videoIds: z.array(z.number()).default([]),
});

export type CreateMediaFolderInput = z.infer<typeof createMediaFolderSchema>;
export type RenameMediaFolderInput = z.infer<typeof renameMediaFolderSchema>;
export type DeleteMediaFolderInput = z.infer<typeof deleteMediaFolderSchema>;
export type ListMediaInput = z.infer<typeof listMediaSchema>;
export type AssignImageFolderInput = z.infer<typeof assignImageFolderSchema>;
export type AssignVideoFolderInput = z.infer<typeof assignVideoFolderSchema>;
export type MoveMediaBatchInput = z.infer<typeof moveMediaBatchSchema>;
export type DeleteMediaBatchInput = z.infer<typeof deleteMediaBatchSchema>;
