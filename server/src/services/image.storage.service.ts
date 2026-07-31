import type { ImageMetadata } from '@shared/types/image.js';
import { ImageStorageServiceError } from '../errors/image.error.js';
import type { DbType } from '../container.js';
import { imagesTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { BaseImageStorageService } from './base.image.storage.service.js';
import { sanitizeFileName } from '../utils/sanitize.filename.js';

export class ImageStorageService extends BaseImageStorageService {
  private readonly db: DbType;

  constructor(
    db: DbType,
    baseDir: string,
    loggerName: string = 'imageStorageService',
  ) {
    super(baseDir, 'images', loggerName);
    this.db = db;
  }

  async upload(file: File, fileName: string, folderId: number | null = null) {
    const safeFileName = sanitizeFileName(fileName);
    const sourceBuffer = Buffer.from(await file.arrayBuffer());
    const optimized = await this.optimizeImageBuffer(
      sourceBuffer,
      safeFileName,
    );

    const namesToReplace = new Set([safeFileName, optimized.fileName]);
    for (const name of namesToReplace) {
      const existing = this.findImageMetadataByFileName(name);
      if (existing) {
        await this.delete(existing.fileName);
      }
    }

    if (
      optimized.fileName !== safeFileName &&
      (await this.exists(this.getFilePath(safeFileName)))
    ) {
      await this.remove(safeFileName);
      const oldThumb = this.getThumbnailFileName(safeFileName);
      if (await this.exists(this.getFilePath(oldThumb))) {
        await this.remove(oldThumb);
      }
    }

    const savedPath = await this.saveImageBuffer(
      optimized.buffer,
      optimized.fileName,
    );
    await this.writeThumbnail(optimized.fileName);

    const baseMeta = await this.getImageMetadata(optimized.fileName);
    const savedFileName = this.saveImageMetadata(
      {
        ...baseMeta,
        thumbnail: this.getThumbnailFileName(optimized.fileName),
      },
      folderId,
    );

    this.logger.info(
      {
        savedPath,
        folderId,
        originalFileName: fileName,
        savedFileName,
        optimized: optimized.changed,
        fn: 'upload',
      },
      'Image uploaded successfully',
    );

    return { path: savedPath, savedFileName };
  }

  async delete(fileName: string) {
    this.removeImageMetadataByFileName(fileName);

    const filesToDelete = [fileName, this.getThumbnailFileName(fileName)];

    for (const file of filesToDelete) {
      if (await this.exists(this.getFilePath(file))) {
        await this.remove(file);

        this.logger.info({ file, fn: 'delete' }, 'Image deleted successfully');
      }
    }
  }

  private async writeThumbnail(fileName: string) {
    const resizedBuffer = await this.resizeImage(fileName, null, 150);
    if (resizedBuffer) {
      await this.saveImageBuffer(
        resizedBuffer,
        this.getThumbnailFileName(fileName),
      );
    }
  }

  /**
   * Re-encodes a file on disk when optimization applies.
   * Returns the final file name (may change extension to .webp).
   */
  private async ensureOptimizedFile(fileName: string): Promise<string> {
    if (this.isSvgFileName(fileName)) {
      return fileName;
    }

    if (!(await this.exists(this.getFilePath(fileName)))) {
      return fileName;
    }

    const sourceBuffer = await this.readFile(fileName);
    const optimized = await this.optimizeImageBuffer(sourceBuffer, fileName);

    if (!optimized.changed) {
      return fileName;
    }

    await this.saveImageBuffer(optimized.buffer, optimized.fileName);

    if (optimized.fileName !== fileName) {
      await this.remove(fileName);
      const oldThumb = this.getThumbnailFileName(fileName);
      if (await this.exists(this.getFilePath(oldThumb))) {
        await this.remove(oldThumb);
      }
    }

    await this.writeThumbnail(optimized.fileName);

    this.logger.info(
      {
        from: fileName,
        to: optimized.fileName,
        beforeSize: sourceBuffer.length,
        afterSize: optimized.buffer.length,
        fn: 'ensureOptimizedFile',
      },
      'Image optimized on disk',
    );

    return optimized.fileName;
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
    } catch (err) {
      this.logger.error(
        { err, fn: 'saveImageMetadata' },
        'Error saving image metadata',
      );
      throw new ImageStorageServiceError(500, 'Error saving image metadata');
    }
  }

  private updateImageMetadata(oldFileName: string, meta: ImageMetadata) {
    try {
      this.db
        .update(imagesTable)
        .set({
          name: meta.name,
          fileName: meta.fileName,
          format: meta.format,
          width: meta.width,
          height: meta.height,
          size: meta.size,
          thumbnail: meta.thumbnail,
          mtime: meta.mtime,
        })
        .where(eq(imagesTable.fileName, oldFileName))
        .run();

      this.logger.info(
        { oldFileName, fileName: meta.fileName, fn: 'updateImageMetadata' },
        'Image metadata updated successfully',
      );
    } catch (err) {
      this.logger.error(
        { err, oldFileName, fn: 'updateImageMetadata' },
        'Error updating image metadata',
      );
      throw new ImageStorageServiceError(500, 'Error updating image metadata');
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
    } catch (err) {
      this.logger.error(
        { err, fn: 'removeImageMetadataByFileName' },
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
        const finalName = await this.ensureOptimizedFile(file);
        const baseMeta = await this.getImageMetadata(finalName);

        this.saveImageMetadata({
          ...baseMeta,
          thumbnail: this.getThumbnailFileName(baseMeta.fileName),
        });
      }
    }

    for (const image of this.listImageMetadata()) {
      if (!(await this.exists(this.getFilePath(image.fileName)))) {
        this.removeImageMetadataByFileName(image.fileName);
        continue;
      }

      const finalName = await this.ensureOptimizedFile(image.fileName);
      if (finalName === image.fileName) {
        continue;
      }

      const baseMeta = await this.getImageMetadata(finalName);
      this.updateImageMetadata(image.fileName, {
        ...baseMeta,
        thumbnail: this.getThumbnailFileName(finalName),
      });
    }
  }
}
