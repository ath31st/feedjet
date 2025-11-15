import { promises as fs, createWriteStream } from 'node:fs';
import * as path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createServiceLogger } from '../utils/pino.logger.js';

export class FileStorageService {
  protected baseDir: string;
  protected logger;

  constructor(baseDir: string, loggerName: string = 'fileStorageService') {
    this.baseDir = baseDir;
    this.logger = createServiceLogger(loggerName);
  }

  protected getFilePath(fileName: string) {
    return path.join(this.baseDir, fileName);
  }

  getBaseDir() {
    return this.baseDir;
  }

  async saveBuffer(buffer: Buffer, originalName: string) {
    const filePath = this.getFilePath(originalName);
    await fs.writeFile(filePath, buffer);
    return filePath;
  }

  async saveStream(readable: NodeJS.ReadableStream, originalName: string) {
    const filePath = this.getFilePath(originalName);
    const writeStream = createWriteStream(filePath);
    await pipeline(readable, writeStream);
    return filePath;
  }

  async readFile(originalName: string) {
    const filePath = this.getFilePath(originalName);
    return fs.readFile(filePath);
  }

  async remove(originalName: string) {
    const filePath = this.getFilePath(originalName);
    try {
      await fs.unlink(filePath);
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        (err as NodeJS.ErrnoException).code !== 'ENOENT'
      ) {
        throw err;
      }
    }
  }

  async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async listFiles() {
    const files = await fs.readdir(this.baseDir);
    return files;
  }

  async getDiskUsage() {
    const stats = await fs.statfs(this.baseDir);

    const blockSize = stats.bsize;
    const total = stats.blocks * blockSize;
    const free = stats.bavail * blockSize;
    const used = total - free;

    return {
      total,
      used,
      free,
    };
  }

  async getFileStats(fileName: string) {
    const filePath = this.getFilePath(fileName);
    const stats = await fs.stat(filePath);
    return stats;
  }
}
