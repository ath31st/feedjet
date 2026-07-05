import { FileStorageService } from './file.storage.service.js';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import sharp from 'sharp';
import { FileStorageError } from '../errors/file.storage.error.js';
import type { BaseImageMetadata } from '@shared/types/image.js';
import { webReadableToNode } from '../utils/stream.js';

export abstract class BaseImageStorageService extends FileStorageService {
  protected readonly imageDir: string;

  protected readonly allowedExtensions = [
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
    '.svg',
    '.SVG',
  ];

  constructor(baseDir: string, imageDir: string, loggerName: string) {
    super(baseDir, loggerName);

    this.imageDir = imageDir;

    fs.mkdir(path.join(this.baseDir, this.imageDir), {
      recursive: true,
    });
  }

  protected override getFilePath(fileName: string) {
    return path.join(this.baseDir, this.imageDir, fileName);
  }

  override getBaseDir() {
    return path.join(this.baseDir, this.imageDir);
  }

  override async listFiles(): Promise<string[]> {
    return fs.readdir(this.getBaseDir());
  }

  protected isImageFile(fileName: string): boolean {
    return this.allowedExtensions.includes(
      path.extname(fileName).toLowerCase(),
    );
  }

  protected validateImageExtension(fileName: string) {
    if (!this.isImageFile(fileName)) {
      this.logger.error(
        { fileName, fn: 'validateImageExtension' },
        'Unsupported file type',
      );

      throw new FileStorageError(400, 'Unsupported file type');
    }
  }

  protected async saveImageBuffer(buffer: Buffer, fileName: string) {
    this.validateImageExtension(fileName);
    return this.saveBuffer(buffer, fileName);
  }

  protected async saveImageStream(
    stream: NodeJS.ReadableStream,
    fileName: string,
  ) {
    this.validateImageExtension(fileName);
    return this.saveStream(stream, fileName);
  }

  protected async getImageMetadata(
    fileName: string,
  ): Promise<BaseImageMetadata> {
    const filePath = this.getFilePath(fileName);

    if (!(await this.exists(filePath))) {
      this.logger.error({ fileName, fn: 'getImageMetadata' }, 'File not found');

      throw new FileStorageError(404, 'File not found');
    }

    const stats = await this.getFileStats(fileName);

    const metadata = await sharp(filePath).metadata();

    const name = path.basename(fileName, path.extname(fileName));

    return {
      name,
      fileName,
      format: metadata.format ?? 'unknown',
      width: metadata.width ?? 0,
      height: metadata.height ?? 0,
      size: stats.size,
      createdAt: stats.birthtime.getTime(),
      mtime: stats.mtime.getTime(),
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
  protected async resizeImage(
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

  protected getNodeStream(file: File) {
    return webReadableToNode(file.stream());
  }

  protected getThumbnailFileName(fileName: string) {
    const ext = path.extname(fileName);
    const name = path.basename(fileName, ext);

    return `${name}_thumbnail${ext}`;
  }
}
