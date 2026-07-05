import type { ImageMetadata } from '@shared/types/image.js';
import { ImageStorageServiceError } from '../errors/image.error.js';
import type { DbType } from '../container.js';
import { imagesTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { BaseImageStorageService } from './base.image.storage.service.js';

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
    const nodeStream = this.getNodeStream(file);
    const savedPath = await this.saveImageStream(nodeStream, fileName);

    const resizedBuffer = await this.resizeImage(fileName, null, 150);
    if (resizedBuffer) {
      await this.saveImageBuffer(
        resizedBuffer,
        this.getThumbnailFileName(fileName),
      );
    }

    let meta = this.findImageMetadataByFileName(fileName);
    if (meta) {
      this.removeImageMetadataByFileName(fileName);
    }
    const baseMeta = await this.getImageMetadata(fileName);

    meta = {
      ...baseMeta,
      thumbnail: this.getThumbnailFileName(fileName),
    };

    const savedFileName = this.saveImageMetadata(meta, folderId);

    this.logger.info(
      { savedPath, folderId, fn: 'upload' },
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
        const baseMeta = await this.getImageMetadata(file);

        this.saveImageMetadata({
          ...baseMeta,
          thumbnail: this.getThumbnailFileName(baseMeta.fileName),
        });
      }
    }

    for (const image of this.listImageMetadata()) {
      if (!files.includes(image.fileName)) {
        this.removeImageMetadataByFileName(image.fileName);
      }
    }
  }
}
