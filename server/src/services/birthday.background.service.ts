import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ImageStorageService } from './image.storage.service.js';
import { webReadableToNode } from '../utils/stream.js';
import {
  type BirthdayBackground,
  MONTHS,
} from '@shared/types/birthday.background.js';
import type { DbType } from '../container.js';

export class BirthdayBackgroundService extends ImageStorageService {
  private readonly backgroundsDir = 'backgrounds';

  constructor(
    db: DbType,
    baseDir: string,
    loggerName: string = 'birthdayBackgroundService',
  ) {
    super(db, baseDir, loggerName);
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

    return targetFile ?? null;
  }

  async uploadBackgroundByMonth(month: number, file: File) {
    if (month < 1 || month > 12) {
      throw new Error('Invalid month');
    }

    const ext = path.extname(file.name).toLowerCase();
    const targetFileName = `${month.toString().padStart(2, '0')}${ext}`;

    const nodeStream = webReadableToNode(file.stream());

    const savedPath = await this.saveImageStream(nodeStream, targetFileName);

    const resizedBuffer = await this.resizeImage(targetFileName, null, 150);
    if (resizedBuffer) {
      const previewFileName = `${month.toString().padStart(2, '0')}_thumbnail${ext}`;
      await this.saveImageBuffer(resizedBuffer, previewFileName);
    }

    this.logger.info(
      { savedPath, fn: 'uploadBackgroundByMonth' },
      'Background uploaded successfully',
    );

    return savedPath;
  }

  async removeBackgroundByMonth(month: number) {
    const files = await this.listFiles();
    const targetFiles = files.filter((f) =>
      f.startsWith(month.toString().padStart(2, '0')),
    );

    if (targetFiles) {
      for (const targetFile of targetFiles) {
        await this.remove(targetFile);
        this.logger.info(
          { fileName: targetFile, fn: 'removeBackgroundByMonth' },
          'Background deleted successfully',
        );
      }
    }
  }

  async listBackgrounds(): Promise<BirthdayBackground[]> {
    const files = await this.listFiles();
    const result: BirthdayBackground[] = [];

    for (let i = 1; i <= 12; i++) {
      const monthPrefix = i.toString().padStart(2, '0');
      const fileNames = files.filter((file) => file.startsWith(monthPrefix));

      let stats = null;
      const mainFile = fileNames[0] || null;
      if (mainFile) {
        stats = await this.getFileStats(mainFile);
      }

      result.push({
        fileName: mainFile,
        monthNumber: i,
        monthName: MONTHS[i],
        thumbnail: fileNames[1] || null,
        mtime: stats?.mtime.getTime() || null,
      });
    }

    return result;
  }
}
