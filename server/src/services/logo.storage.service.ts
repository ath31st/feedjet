import type { DbType } from '../container.js';
import { logosTable } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { BaseImageStorageService } from './base.image.storage.service.js';
import { ImageStorageServiceError } from '../errors/image.error.js';
import type { BaseImageMetadata } from '@shared/types/image.js';
import type { Logo } from '@shared/types/logo.js';
import { LogoStorageError } from '../errors/logo.storage.error.js';

export class LogoStorageService extends BaseImageStorageService {
  private readonly db: DbType;

  constructor(db: DbType, baseDir: string, loggerName = 'logoStorageService') {
    super(baseDir, 'logos', loggerName);

    this.db = db;
  }

  // TODO: после ввода организаций, нужно будет сделать выборку по организации
  findCurrentLogo(): Logo | null {
    try {
      return (
        this.db
          .select()
          .from(logosTable)
          .orderBy(desc(logosTable.id))
          .limit(1)
          .get() ?? null
      );
    } catch (err) {
      this.logger.error(
        { err, fn: 'findCurrentLogo' },
        'Failed to find current logo',
      );
      throw new LogoStorageError(500, 'Failed to find current logo');
    }
  }

  async replace(file: File, fileName: string): Promise<Logo | null> {
    try {
      const currentLogo = this.findCurrentLogo();

      if (currentLogo) {
        await this.delete(currentLogo.fileName);
      }

      const nodeStream = this.getNodeStream(file);
      const savedPath = await this.saveImageStream(nodeStream, fileName);

      const meta = await this.getImageMetadata(fileName);
      const savedFileName = this.saveLogoMetadata(meta);

      this.logger.info(
        { savedPath, savedFileName, fn: 'replace' },
        'Logo replaced successfully',
      );

      return this.findCurrentLogo();
    } catch (err) {
      this.logger.error({ err, fn: 'replace' }, 'Failed to replace logo');
      throw new LogoStorageError(500, 'Failed to replace logo');
    }
  }

  async delete(fileName: string) {
    try {
      this.removeLogoMetadataByFileName(fileName);

      if (await this.exists(this.getFilePath(fileName))) {
        await this.remove(fileName);

        this.logger.info(
          { fileName, fn: 'delete' },
          'Logo deleted successfully',
        );
      }
    } catch (err) {
      this.logger.error({ err, fn: 'delete' }, 'Failed to delete logo');
      throw new LogoStorageError(500, 'Failed to delete logo');
    }
  }

  private saveLogoMetadata(meta: BaseImageMetadata): string {
    this.logger.debug({ meta, fn: 'saveLogoMetadata' }, 'Saving logo metadata');

    try {
      const { fileName } = this.db
        .insert(logosTable)
        .values({
          fileName: meta.fileName,
          originalName: meta.name,
          size: meta.size,
          width: meta.width,
          height: meta.height,
        })
        .returning({
          fileName: logosTable.fileName,
        })
        .get();

      this.logger.info(
        { fileName, fn: 'saveLogoMetadata' },
        'Logo metadata saved successfully',
      );

      return fileName;
    } catch (error) {
      this.logger.error(
        { error, fn: 'saveLogoMetadata' },
        'Error saving logo metadata',
      );

      throw new ImageStorageServiceError(500, 'Error saving logo metadata');
    }
  }

  private removeLogoMetadataByFileName(fileName: string) {
    try {
      this.db.delete(logosTable).where(eq(logosTable.fileName, fileName)).run();

      this.logger.info(
        { fileName, fn: 'removeLogoMetadataByFileName' },
        'Logo metadata removed successfully',
      );
    } catch (error) {
      this.logger.error(
        { error, fn: 'removeLogoMetadataByFileName' },
        'Error removing logo metadata',
      );

      throw new LogoStorageError(500, 'Error removing logo metadata');
    }
  }
}
