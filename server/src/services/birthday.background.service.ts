import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ImageStorageService } from './image.storage.service.js';
import { webReadableToNode } from '../utils/stream.js';

export class BirthdayBackgroundService extends ImageStorageService {
  private readonly backgroundsDir = 'backgrounds';

  constructor(baseDir: string, loggerName: string = 'birthdayFileService') {
    super(baseDir, loggerName);
    fs.mkdir(path.join(this.baseDir, this.backgroundsDir), { recursive: true });
  }

  protected override getFilePath(fileName: string) {
    return path.join(this.baseDir, this.backgroundsDir, fileName);
  }

  override async listFiles() {
    const dir = path.join(this.baseDir, this.backgroundsDir);
    return fs.readdir(dir);
  }

  override getBaseDir() {
    return path.join(this.baseDir, this.backgroundsDir);
  }

  async getBackgroundByMonth(month: number) {
    const files = await this.listFiles();

    const targetFile = files.find((f) =>
      f.startsWith(month.toString().padStart(2, '0')),
    );

    return targetFile;
  }

  async uploadBackgroundByMonth(month: number, file: File) {
    if (month < 1 || month > 12) {
      throw new Error('Invalid month');
    }

    const ext = path.extname(file.name).toLowerCase();
    const targetFileName = `${month.toString().padStart(2, '0')}${ext}`;

    const nodeStream = webReadableToNode(file.stream());

    const savedPath = await this.saveImageStream(nodeStream, targetFileName);

    this.logger.info(
      { savedPath, fn: 'uploadBackgroundByMonth' },
      'Background uploaded successfully',
    );

    return savedPath;
  }

  async removeBackgroundByMonth(month: number) {
    const files = await this.listFiles();
    const targetFile = files.find((f) =>
      f.startsWith(month.toString().padStart(2, '0')),
    );

    if (targetFile) {
      await this.remove(targetFile);
      this.logger.info(
        { fileName: targetFile, fn: 'removeBackgroundByMonth' },
        'Background deleted successfully',
      );
    }
  }

  async listBackgrounds(): Promise<Record<number, string | null>> {
    const files = await this.listFiles();
    const result: Record<number, string | null> = {};

    for (let i = 1; i <= 12; i++) {
      const f = files.find((file) =>
        file.startsWith(i.toString().padStart(2, '0')),
      );
      result[i] = f || null;
    }

    return result;
  }
}
