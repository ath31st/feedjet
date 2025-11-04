import { FileStorageService } from './file.storage.service.js';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import sharp from 'sharp';
import { FileStorageError } from '../errors/file.storage.error.js';
import type { ImageMetadata } from '@shared/types/image.js';

export class ImageStorageService extends FileStorageService {
  private readonly imageDir = 'images';
  private readonly allowedExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.gif',
  ];

  constructor(baseDir: string) {
    super(baseDir);
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

  async saveImageBuffer(buffer: Buffer, fileName: string) {
    if (!this.isImageFile(fileName)) {
      throw new FileStorageError(400, 'Unsupported file type');
    }
    return this.saveBuffer(buffer, fileName);
  }

  async saveImageStream(stream: NodeJS.ReadableStream, fileName: string) {
    if (!this.isImageFile(fileName)) {
      throw new FileStorageError(400, 'Unsupported file type');
    }
    return this.saveStream(stream, fileName);
  }

  async getImageMetadata(fileName: string): Promise<ImageMetadata> {
    const filePath = this.getFilePath(fileName);
    if (!(await this.exists(filePath))) {
      throw new FileStorageError(404, 'File not found');
    }

    const fileStats = await this.getFileStats(fileName);
    const image = sharp(filePath);
    const metadata = await image.metadata();
    const name = path.basename(fileName, path.extname(fileName));

    return {
      name,
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
      size: fileStats.size,
      fileName,
      createdAt: fileStats.birthtime.getTime(),
    };
  }
}
