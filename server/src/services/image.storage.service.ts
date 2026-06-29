import { FileStorageService } from './file.storage.service.js';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import sharp from 'sharp';
import { FileStorageError } from '../errors/file.storage.error.js';
import type { ImageMetadata } from '@shared/types/image.js';
import { webReadableToNode } from '../utils/stream.js';
import { ImageStorageServiceError } from '../errors/image.error.js';
import type { DbType } from '../container.js';
import { imagesTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export class ImageStorageService extends FileStorageService {
  private readonly db: DbType;
  private readonly imageDir = 'images';
  private readonly allowedExtensions = [
    '.jpg',
    '.JPG',
    '.jpeg',
    '.JPEG',
    '.png',
    '.PNG',
    '.webp',
    '.WEBP',
    '.bmp',
    '.BMP',
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

  async upload(file: File, fileName: string, folderId: number | null = null) {
    const ext = path.extname(file.name);

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
    const savedFileName = this.saveImageMetadata(meta, folderId);

    this.logger.info(
      { savedPath, folderId, fn: 'upload' },
      'Image uploaded successfully',
    );

    return { path: savedPath, savedFileName };
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

  private saveImageMetadata(
    meta: ImageMetadata,
    folderId: number | null = null,
  ): string {
    this.logger.debug(
      { meta, folderId, fn: 'saveImageMetadata' },
      'Saving image metadata',
    );

    try {
      const { fileName } = this.db
        .insert(imagesTable)
        .values({ ...meta, folderId })
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
}
