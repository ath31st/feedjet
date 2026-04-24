import { FileStorageService } from './file.storage.service.js';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import sharp from 'sharp';
import { FileStorageError } from '../errors/file.storage.error.js';
import type {
  AdminImageInfo,
  ImageDurationUpdate,
  ImageMetadata,
  ImageOrderUpdate,
  KioskImageInfo,
} from '@shared/types/image.js';
import { webReadableToNode } from '../utils/stream.js';
import { ImageStorageServiceError } from '../errors/image.error.js';
import type { DbType } from '../container.js';
import { imagesTable, kioskImagesTable } from '../db/schema.js';
import { and, eq, asc, sql, inArray } from 'drizzle-orm';

type TxType = Parameters<Parameters<DbType['transaction']>[0]>[0];

type KioskImagePatch = Partial<{
  isActive: boolean;
  order: number;
  durationSeconds: number;
}>;

type KioskImageBatchItem = {
  imageId: number;
  patch: KioskImagePatch;
};

export class ImageStorageService extends FileStorageService {
  private readonly db: DbType;
  private readonly imageDir = 'images';
  private readonly allowedExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.bmp',
  ];

  constructor(
    db: DbType,
    baseDir: string,
    loggerName: string = 'imageStorageService',
  ) {
    super(baseDir, loggerName);
    this.db = db;
    fs.mkdir(path.join(this.baseDir, this.imageDir), { recursive: true });
  }

  protected override getFilePath(fileName: string) {
    return path.join(this.baseDir, this.imageDir, fileName);
  }

  override async listFiles(): Promise<string[]> {
    const dir = path.join(this.baseDir, this.imageDir);
    return fs.readdir(dir);
  }

  override getBaseDir() {
    return path.join(this.baseDir, this.imageDir);
  }

  private isImageFile(fileName: string): boolean {
    const ext = path.extname(fileName).toLowerCase();
    return this.allowedExtensions.includes(ext);
  }

  async upload(file: File, fileName: string) {
    const ext = path.extname(file.name).toLowerCase();

    if (!this.allowedExtensions.includes(ext)) {
      this.logger.error({ fn: 'upload', ext }, 'Unsupported file type');
      throw new FileStorageError(400, 'Unsupported file type');
    }

    const nodeStream = webReadableToNode(file.stream());
    const savedPath = await this.saveImageStream(nodeStream, fileName);

    const resizedBuffer = await this.resizeImage(fileName, null, 150);
    if (resizedBuffer) {
      const name = path.basename(fileName, path.extname(fileName));
      const thumbnailFileName = `${name}_thumbnail${ext}`;
      await this.saveImageBuffer(resizedBuffer, thumbnailFileName);
    }

    let meta = this.findImageMetadataByFileName(fileName);
    if (meta) {
      this.removeImageMetadataByFileName(fileName);
    }
    meta = await this.getImageMetadata(fileName);
    const savedFileName = this.saveImageMetadata(meta);

    this.logger.info(
      { savedPath, fn: 'upload' },
      'Image uploaded successfully',
    );

    return { path: savedPath, savedFileName };
  }

  async update(
    fileName: string,
    kioskId: number,
    isActive: boolean,
    durationSeconds: number,
  ): Promise<boolean> {
    this.logger.debug(
      { fileName, kioskId, isActive, fn: 'update' },
      'Updating image',
    );

    const imageId = this.db
      .select()
      .from(imagesTable)
      .where(eq(imagesTable.fileName, fileName))
      .get()?.id;

    if (!imageId) {
      this.logger.warn({ fileName, fn: 'update' }, 'Image not found');
      throw new ImageStorageServiceError(404, 'Image not found');
    }

    const filePath = this.getFilePath(fileName);
    const fileExists = await this.exists(filePath);

    if (!fileExists) {
      this.removeImageMetadataByFileName(fileName);
      this.logger.warn({ fileName, fn: 'update' }, 'File not found on disk');
      throw new ImageStorageServiceError(404, 'File not found on disk');
    }

    const result = this.upsertKioskImage(
      imageId,
      kioskId,
      isActive,
      durationSeconds,
    );

    this.logger.info(
      { fileName, isActive, fn: 'update' },
      'Image updated successfully',
    );
    return result;
  }

  async delete(fileName: string) {
    this.removeImageMetadataByFileName(fileName);

    const ext = path.extname(fileName);
    const name = path.basename(fileName, ext);

    const thumbnailFileName = `${name}_thumbnail${ext}`;

    const filesToDelete = [fileName, thumbnailFileName];

    for (const f of filesToDelete) {
      const exists = await this.exists(this.getFilePath(f));
      if (exists) {
        await this.remove(f);
        this.logger.info({ f, fn: 'delete' }, 'Image deleted successfully');
      }
    }
  }

  async saveImageBuffer(buffer: Buffer, fileName: string) {
    if (!this.isImageFile(fileName)) {
      this.logger.error(
        { fileName, fn: 'saveImageBuffer' },
        'Unsupported file type',
      );
      throw new FileStorageError(400, 'Unsupported file type');
    }
    return this.saveBuffer(buffer, fileName);
  }

  async saveImageStream(stream: NodeJS.ReadableStream, fileName: string) {
    if (!this.isImageFile(fileName)) {
      this.logger.error(
        { fileName, fn: 'saveImageStream' },
        'Unsupported file type',
      );
      throw new FileStorageError(400, 'Unsupported file type');
    }
    return this.saveStream(stream, fileName);
  }

  private async getImageMetadata(fileName: string): Promise<ImageMetadata> {
    const filePath = this.getFilePath(fileName);
    if (!(await this.exists(filePath))) {
      this.logger.error({ fileName, fn: 'getImageMetadata' }, 'File not found');
      throw new FileStorageError(404, 'File not found');
    }

    const fileStats = await this.getFileStats(fileName);
    const image = sharp(filePath);
    const metadata = await image.metadata();
    const name = path.basename(fileName, path.extname(fileName));

    return {
      name,
      width: metadata.width ?? 0,
      height: metadata.height ?? 0,
      format: metadata.format ?? 'unknown',
      size: fileStats.size,
      fileName,
      createdAt: fileStats.birthtime.getTime(),
      thumbnail: `${name}_thumbnail${path.extname(fileName)}`,
      mtime: fileStats.mtime.getTime(),
    };
  }

  /**
   * Changes the size of the image on disk.
   * @param fileName - file name
   * @param width - new width (if null, proportionally scaled by height)
   * @param height - new height (if null, proportionally scaled by width)
   * @param overwrite - if true, the original file will be overwritten
   * @returns Promise<Buffer | undefined> - buffer of resized image
   */
  async resizeImage(
    fileName: string,
    width: number | null,
    height: number | null,
    overwrite = false,
  ): Promise<Buffer | undefined> {
    const filePath = this.getFilePath(fileName);

    if (!(await this.exists(filePath))) {
      this.logger.error({ fileName, fn: 'resizeImage' }, 'File not found');
      throw new FileStorageError(404, 'File not found');
    }

    const image = sharp(filePath);
    const resized = image.resize(width || undefined, height || undefined);

    if (overwrite) {
      await resized.toFile(filePath);
      return;
    } else {
      return resized.toBuffer();
    }
  }

  private listImageMetadata(): ImageMetadata[] {
    return this.db.select().from(imagesTable).all();
  }

  listAdminImages(kioskId: number): AdminImageInfo[] {
    return this.db
      .select({
        ...this.imageSelect(),
        isActive: kioskImagesTable.isActive,
        order: kioskImagesTable.order,
        durationSeconds: kioskImagesTable.durationSeconds,
      })
      .from(imagesTable)
      .leftJoin(
        kioskImagesTable,
        and(
          eq(imagesTable.id, kioskImagesTable.imageId),
          eq(kioskImagesTable.kioskId, kioskId),
        ),
      )
      .orderBy(
        asc(sql`COALESCE(${kioskImagesTable.order}, 0)`),
        asc(imagesTable.id),
      )
      .all();
  }

  listActiveImagesByKiosk(kioskId: number): KioskImageInfo[] {
    return this.db
      .select({
        ...this.imageSelect(),
        isActive: kioskImagesTable.isActive,
        order: kioskImagesTable.order,
        durationSeconds: kioskImagesTable.durationSeconds,
      })
      .from(imagesTable)
      .innerJoin(kioskImagesTable, eq(imagesTable.id, kioskImagesTable.imageId))
      .where(
        and(
          eq(kioskImagesTable.kioskId, kioskId),
          eq(kioskImagesTable.isActive, true),
        ),
      )
      .orderBy(asc(kioskImagesTable.order))
      .all();
  }

  private saveImageMetadata(meta: ImageMetadata): string {
    this.logger.debug(
      { meta, fn: 'saveVideoMetadata' },
      'Saving video metadata',
    );

    try {
      const { fileName } = this.db
        .insert(imagesTable)
        .values(meta)
        .returning({ fileName: imagesTable.fileName })
        .get();

      this.logger.info(
        { fileName, fn: 'saveImageMetadata' },
        'Image metadata saved successfully',
      );
      return fileName;
    } catch (error) {
      this.logger.error(
        { error, fn: 'saveImageMetadata' },
        'Error saving image metadata',
      );
      throw new ImageStorageServiceError(500, 'Error saving image metadata');
    }
  }

  private upsertKioskImage(
    imageId: number,
    kioskId: number,
    isActive: boolean,
    durationSeconds: number,
  ): boolean {
    this.logger.debug(
      {
        imageId,
        kioskId,
        isActive,
        durationSeconds,
        fn: 'upsertKioskImage',
      },
      'Upserting kiosk image metadata',
    );

    try {
      this.db
        .insert(kioskImagesTable)
        .values({ imageId, kioskId, isActive, durationSeconds })
        .onConflictDoUpdate({
          target: [kioskImagesTable.kioskId, kioskImagesTable.imageId],
          set: { isActive, durationSeconds },
        })
        .run();

      this.logger.info(
        { imageId, kioskId, isActive, fn: 'updateIsActiveImage' },
        'Kiosk image metadata upserted successfully',
      );

      return isActive;
    } catch (error) {
      this.logger.error(
        { error, fn: 'updateIsActiveImage' },
        'Error upserting kiosk image metadata',
      );
      throw new ImageStorageServiceError(
        500,
        'Error upserting kiosk image metadata',
      );
    }
  }

  async updateImageOrderBatch(
    kioskId: number,
    updates: ImageOrderUpdate[],
  ): Promise<void> {
    this.logger.debug(
      { kioskId, updatesCount: updates.length, fn: 'updateImageOrderBatch' },
      'Starting batch order update',
    );

    try {
      await this.db.transaction(async (tx) => {
        if (updates.length === 0) return;

        const fileNames = updates.map((u) => u.fileName);

        const rows = tx
          .select({
            id: imagesTable.id,
            fileName: imagesTable.fileName,
          })
          .from(imagesTable)
          .where(inArray(imagesTable.fileName, fileNames))
          .all();

        const map = new Map(rows.map((r) => [r.fileName, r.id]));

        const items: KioskImageBatchItem[] = [];

        for (const { fileName, order } of updates) {
          const imageId = map.get(fileName);

          if (!imageId) {
            this.logger.warn({ fileName }, 'Image not found, skipping');
            continue;
          }

          items.push({
            imageId,
            patch: { order },
          });
        }

        this.upsertKioskImagesBatch(tx, kioskId, items);
      });

      this.logger.info(
        { kioskId, updatesCount: updates.length },
        'Batch order update completed successfully',
      );
    } catch (error) {
      this.logger.error(
        { error, kioskId, fn: 'updateImageOrderBatch' },
        'Error performing batch order update',
      );
      throw new ImageStorageServiceError(
        500,
        'Error updating image order batch',
      );
    }
  }

  async updateImageDuration(
    fileName: string,
    kioskId: number,
    durationSeconds: number,
  ): Promise<void> {
    return this.updateImageDurationBatch(kioskId, [
      { fileName, durationSeconds },
    ]);
  }

  async updateImageDurationBatch(
    kioskId: number,
    updates: ImageDurationUpdate[],
  ): Promise<void> {
    this.logger.debug(
      { kioskId, updatesCount: updates.length, fn: 'updateImageDurationBatch' },
      'Starting batch duration update',
    );

    try {
      await this.db.transaction(async (tx) => {
        if (updates.length === 0) return;

        const fileNames = updates.map((u) => u.fileName);

        const rows = tx
          .select({
            id: imagesTable.id,
            fileName: imagesTable.fileName,
          })
          .from(imagesTable)
          .where(inArray(imagesTable.fileName, fileNames))
          .all();

        const map = new Map(rows.map((r) => [r.fileName, r.id]));

        const items: KioskImageBatchItem[] = [];

        for (const { fileName, durationSeconds } of updates) {
          const imageId = map.get(fileName);

          if (!imageId) {
            this.logger.warn({ fileName }, 'Image not found, skipping');
            continue;
          }

          items.push({
            imageId,
            patch: { durationSeconds },
          });
        }

        this.upsertKioskImagesBatch(tx, kioskId, items);
      });

      this.logger.info(
        { kioskId, updatesCount: updates.length },
        'Batch duration update completed successfully',
      );
    } catch (error) {
      this.logger.error(
        { error, kioskId, fn: 'updateImageDurationBatch' },
        'Error performing batch duration update',
      );
      throw new ImageStorageServiceError(
        500,
        'Error updating image durations batch',
      );
    }
  }

  private upsertKioskImagesBatch(
    tx: TxType,
    kioskId: number,
    items: KioskImageBatchItem[],
  ) {
    if (items.length === 0) return;

    const values = items.map(({ imageId, patch }) => ({
      kioskId,
      imageId,
      ...patch,
    }));

    console.log('values', values);

    tx.insert(kioskImagesTable)
      .values(values)
      .onConflictDoUpdate({
        target: [kioskImagesTable.kioskId, kioskImagesTable.imageId],
        set: {
          isActive: sql.raw(`excluded.is_active`),
          order: sql.raw(`excluded."order"`),
          durationSeconds: sql.raw(`excluded.duration_seconds`),
        },
      })
      .run();
  }

  private removeImageMetadataByFileName(fileName: string) {
    try {
      this.db
        .delete(imagesTable)
        .where(eq(imagesTable.fileName, fileName))
        .run();
      this.logger.info(
        { fileName, fn: 'removeImageMetadataByFileName' },
        'Image metadata removed successfully',
      );
    } catch (error) {
      this.logger.error(
        { error, fn: 'removeImageMetadataByFileName' },
        'Error removing image metadata',
      );
      throw new ImageStorageServiceError(500, 'Error removing image metadata');
    }
  }

  private findImageMetadataByFileName(
    fileName: string,
  ): ImageMetadata | undefined {
    return this.db
      .select()
      .from(imagesTable)
      .where(eq(imagesTable.fileName, fileName))
      .get();
  }

  async syncWithDisk() {
    const files = await this.listFiles();
    const withoutThumbnails = files.filter((f) => !f.includes('_thumbnail'));
    const existing = new Set(this.listImageMetadata().map((i) => i.fileName));

    for (const file of withoutThumbnails) {
      if (!existing.has(file)) {
        const meta = await this.getImageMetadata(file);
        this.saveImageMetadata(meta);
      }
    }

    for (const video of this.listImageMetadata()) {
      if (!files.includes(video.fileName)) {
        this.removeImageMetadataByFileName(video.fileName);
      }
    }
  }

  private imageSelect() {
    return {
      id: imagesTable.id,
      name: imagesTable.name,
      fileName: imagesTable.fileName,
      format: imagesTable.format,
      width: imagesTable.width,
      height: imagesTable.height,
      size: imagesTable.size,
      createdAt: imagesTable.createdAt,
      thumbnail: imagesTable.thumbnail,
      mtime: imagesTable.mtime,
    };
  }
}
