import type { DbType } from '../container.js';
import { mediaFoldersTable, imagesTable, videosTable } from '../db/schema.js';
import { eq, inArray, sql } from 'drizzle-orm';
import type {
  MediaFolder,
  MediaFolderTree,
} from '@shared/types/media.folder.js';
import { createServiceLogger } from '../utils/pino.logger.js';

export class MediaFolderService {
  private readonly db: DbType;
  private readonly logger = createServiceLogger('mediaFolderService');

  constructor(db: DbType) {
    this.db = db;
  }

  getAll(): MediaFolder[] {
    return this.db.select().from(mediaFoldersTable).all();
  }

  getTree(): MediaFolderTree[] {
    const all = this.getAll();
    return this.buildTree(all, null);
  }

  private buildTree(
    folders: MediaFolder[],
    parentId: number | null,
  ): MediaFolderTree[] {
    return folders
      .filter((f) => f.parentId === parentId)
      .map((f) => ({
        ...f,
        children: this.buildTree(folders, f.id),
      }));
  }

  create(name: string, parentId: number | null): MediaFolder {
    const result = this.db
      .insert(mediaFoldersTable)
      .values({ name, parentId })
      .returning()
      .get();

    this.logger.info(
      { id: result.id, name, parentId, fn: 'create' },
      'Created media folder',
    );
    return result;
  }

  rename(id: number, name: string): MediaFolder {
    const result = this.db
      .update(mediaFoldersTable)
      .set({ name })
      .where(eq(mediaFoldersTable.id, id))
      .returning()
      .get();

    if (!result) {
      this.logger.warn({ id, name, fn: 'rename' }, 'Folder not found');
      throw new Error('Folder not found');
    }

    this.logger.info({ id, name, fn: 'rename' }, 'Renamed media folder');
    return result;
  }

  delete(id: number): void {
    this.db
      .update(imagesTable)
      .set({ folderId: null })
      .where(eq(imagesTable.folderId, id))
      .run();
    this.db
      .update(videosTable)
      .set({ folderId: null })
      .where(eq(videosTable.folderId, id))
      .run();
    this.db.delete(mediaFoldersTable).where(eq(mediaFoldersTable.id, id)).run();

    this.logger.info({ id, fn: 'delete' }, 'Deleted media folder');
  }

  assignImageToFolder(imageId: number, folderId: number | null): void {
    this.db
      .update(imagesTable)
      .set({ folderId })
      .where(eq(imagesTable.id, imageId))
      .run();

    this.logger.info(
      { imageId, folderId, fn: 'assignImageToFolder' },
      'Assigned image to folder',
    );
  }

  assignVideoToFolder(videoId: number, folderId: number | null): void {
    this.db
      .update(videosTable)
      .set({ folderId })
      .where(eq(videosTable.id, videoId))
      .run();

    this.logger.info(
      { videoId, folderId, fn: 'assignVideoToFolder' },
      'Assigned video to folder',
    );
  }

  moveMediaBatch(
    folderId: number | null,
    imageIds: number[],
    videoIds: number[],
  ): void {
    this.db.transaction((tx) => {
      if (imageIds.length > 0) {
        tx.update(imagesTable)
          .set({ folderId })
          .where(inArray(imagesTable.id, imageIds))
          .run();
      }
      if (videoIds.length > 0) {
        tx.update(videosTable)
          .set({ folderId })
          .where(inArray(videosTable.id, videoIds))
          .run();
      }
    });

    this.logger.info(
      {
        folderId,
        imageCount: imageIds.length,
        videoCount: videoIds.length,
        fn: 'moveMediaBatch',
      },
      'Moved media batch',
    );
  }

  getFileNamesByIds(
    imageIds: number[],
    videoIds: number[],
  ): { imageFileNames: string[]; videoFileNames: string[] } {
    const imageFileNames =
      imageIds.length === 0
        ? []
        : this.db
            .select({ fileName: imagesTable.fileName })
            .from(imagesTable)
            .where(inArray(imagesTable.id, imageIds))
            .all()
            .map((r) => r.fileName);

    const videoFileNames =
      videoIds.length === 0
        ? []
        : this.db
            .select({ fileName: videosTable.fileName })
            .from(videosTable)
            .where(inArray(videosTable.id, videoIds))
            .all()
            .map((r) => r.fileName);

    return { imageFileNames, videoFileNames };
  }

  listAllImages(folderId: number | null) {
    const query = this.db.select().from(imagesTable);
    const rows =
      folderId === null
        ? query.all()
        : query.where(eq(imagesTable.folderId, folderId)).all();
    return rows.map((img) => ({ ...img, kind: 'image' as const }));
  }

  listAllVideos(folderId: number | null) {
    const query = this.db.select().from(videosTable);
    const rows =
      folderId === null
        ? query.all()
        : query.where(eq(videosTable.folderId, folderId)).all();
    return rows.map((v) => ({ ...v, kind: 'video' as const }));
  }

  listAllMedia(folderId: number | null) {
    const images = this.listAllImages(folderId);
    const videos = this.listAllVideos(folderId);
    return [...images, ...videos];
  }

  countAllImages(): number {
    const result = this.db
      .select({ count: sql<number>`count(*)` })
      .from(imagesTable)
      .get();
    return result?.count ?? 0;
  }

  countAllVideos(): number {
    const result = this.db
      .select({ count: sql<number>`count(*)` })
      .from(videosTable)
      .get();
    return result?.count ?? 0;
  }
}
