import type { DbType } from '../container.js';
import { mediaFoldersTable, imagesTable, videosTable } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';
import type {
  MediaFolder,
  MediaFolderTree,
} from '@shared/types/media.folder.js';

export class MediaFolderService {
  private readonly db: DbType;

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
    return result;
  }

  rename(id: number, name: string): MediaFolder {
    const result = this.db
      .update(mediaFoldersTable)
      .set({ name })
      .where(eq(mediaFoldersTable.id, id))
      .returning()
      .get();
    if (!result) throw new Error('Folder not found');
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
  }

  assignImageToFolder(imageId: number, folderId: number | null): void {
    this.db
      .update(imagesTable)
      .set({ folderId })
      .where(eq(imagesTable.id, imageId))
      .run();
  }

  assignVideoToFolder(videoId: number, folderId: number | null): void {
    this.db
      .update(videosTable)
      .set({ folderId })
      .where(eq(videosTable.id, videoId))
      .run();
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
