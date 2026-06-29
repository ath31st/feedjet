import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { FileStorageService } from './file.storage.service.js';
import type { VideoMetadata } from '@shared/types/video.js';
import path from 'node:path';
import type { DbType } from '../container.js';
import { videosTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { VideoStorageServiceError } from '../errors/video.error.js';
import { webReadableToNode } from '../utils/stream.js';
import { promises as fs } from 'node:fs';

const execFileAsync = promisify(execFile);

export class VideoStorageService extends FileStorageService {
  private readonly db: DbType;
  private readonly videosDir = 'videos';

  constructor(
    db: DbType,
    baseDir: string,
    loggerName: string = 'videoStorageService',
  ) {
    super(baseDir, loggerName);
    this.db = db;
    fs.mkdir(path.join(this.baseDir, this.videosDir), { recursive: true });
  }

  protected override getFilePath(fileName: string) {
    return path.join(this.baseDir, this.videosDir, fileName);
  }

  override async listFiles() {
    const dir = path.join(this.baseDir, this.videosDir);
    return fs.readdir(dir);
  }

  override getBaseDir() {
    return path.join(this.baseDir, this.videosDir);
  }

  async upload(
    file: File,
    filename: string,
    folderId: number | null = null,
  ): Promise<{ path: string; savedFileName: string }> {
    const nodeStream = webReadableToNode(file.stream());

    const savedPath = await this.saveStream(nodeStream, filename);

    let meta = this.findVideoMetadataByFileName(filename);
    if (meta) {
      this.removeVideoMetadataByFileName(filename);
    }
    meta = await this.getVideoMetadata(filename);
    const savedFileName = this.saveVideoMetadata(meta, folderId);

    this.logger.info(
      { savedPath, savedFileName, folderId, fn: 'upload' },
      'Video uploaded',
    );
    return { path: savedPath, savedFileName };
  }

  async delete(fileName: string) {
    this.removeVideoMetadataByFileName(fileName);
    await super.remove(fileName);
    this.logger.info({ fileName, fn: 'delete' }, 'Video deleted successfully');
  }

  private async getVideoMetadata(fileName: string): Promise<VideoMetadata> {
    const filePath = this.getFilePath(fileName);

    const { stdout } = await execFileAsync('ffprobe', [
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-show_entries',
      'stream=width,height',
      '-show_entries',
      'format=format_name,duration',
      '-of',
      'json',
      filePath,
    ]);

    const info = JSON.parse(stdout);
    const stream = info.streams?.[0] ?? {};
    const format = info.format ?? {};
    const formats = (format.format_name ?? '').split(',');
    const ext = path.extname(fileName).slice(1);
    const name = path.basename(fileName, path.extname(fileName));
    const actualFormat = formats.includes(ext) ? ext : (formats[0] ?? '');

    const fileStats = await this.getFileStats(fileName);

    return {
      name: name,
      fileName: fileName,
      format: actualFormat,
      duration: Math.round(parseFloat(format.duration ?? '0')),
      width: stream.width ?? 0,
      height: stream.height ?? 0,
      size: fileStats.size,
      mtime: fileStats.mtime.getTime(),
      createdAt: fileStats.birthtime.getTime(),
    };
  }

  private listVideoMetadata(): VideoMetadata[] {
    return this.db.select().from(videosTable).all();
  }

  private saveVideoMetadata(
    meta: VideoMetadata,
    folderId: number | null = null,
  ): string {
    this.logger.debug(
      { meta, folderId, fn: 'saveVideoMetadata' },
      'Saving video metadata',
    );

    try {
      const { fileName } = this.db
        .insert(videosTable)
        .values({ ...meta, folderId })
        .returning({ fileName: videosTable.fileName })
        .get();

      this.logger.info(
        { fileName, fn: 'saveVideoMetadata' },
        'Video metadata saved successfully',
      );
      return fileName;
    } catch (error) {
      this.logger.error(
        { error, fn: 'saveVideoMetadata' },
        'Error saving video metadata',
      );
      throw new VideoStorageServiceError(500, 'Error saving video metadata');
    }
  }

  removeVideoMetadataByFileName(fileName: string) {
    try {
      this.db
        .delete(videosTable)
        .where(eq(videosTable.fileName, fileName))
        .run();
      this.logger.info(
        { fileName, fn: 'removeVideoMetadataByFileName' },
        'Video metadata removed successfully',
      );
    } catch (error) {
      this.logger.error(
        { error, fn: 'removeVideoMetadataByFileName' },
        'Error removing video metadata',
      );
      throw new VideoStorageServiceError(500, 'Error removing video metadata');
    }
  }

  findVideoMetadataByFileName(fileName: string): VideoMetadata | undefined {
    return this.db
      .select()
      .from(videosTable)
      .where(eq(videosTable.fileName, fileName))
      .get();
  }

  async syncWithDisk() {
    const files = await this.listFiles();
    const existing = new Set(this.listVideoMetadata().map((v) => v.fileName));

    for (const file of files) {
      if (!existing.has(file)) {
        const meta = await this.getVideoMetadata(file);
        this.saveVideoMetadata(meta);
      }
    }

    for (const video of this.listVideoMetadata()) {
      if (!files.includes(video.fileName)) {
        this.removeVideoMetadataByFileName(video.fileName);
      }
    }
  }
}
