import { promises as fs, createWriteStream } from 'node:fs';
import * as path from 'node:path';
import { pipeline } from 'node:stream/promises';

export class FileStorageService {
  private baseDir: string;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
  }

  protected getFilePath(fileName: string) {
    return path.join(this.baseDir, fileName);
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
    await fs.unlink(filePath);
  }

  async listFiles() {
    const files = await fs.readdir(this.baseDir);
    return files;
  }
}
