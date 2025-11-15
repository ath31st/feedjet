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
  ): Promise<{ path: string; savedFileName: string }> {
    const nodeStream = webReadableToNode(file.stream());

    const savedPath = await this.saveStream(nodeStream, filename);

    let meta = this.findVideoMetadataByFileName(filename);
    if (meta) {
      this.removeVideoMetadataByFileName(filename);
    }
    meta = await this.getVideoMetadata(filename);
    const savedFileName = this.saveVideoMetadata(meta);

    this.logger.info(
      { savedPath, savedFileName, fn: 'upload' },
      'Video uploaded',
    );
    return { path: savedPath, savedFileName };
  }

  async update(fileName: string, isActive: boolean): Promise<boolean> {
    this.logger.debug({ fileName, isActive, fn: 'update' }, 'Updating video');

    const filePath = this.getFilePath(fileName);
    const fileExists = await this.exists(filePath);

    if (!fileExists) {
      this.removeVideoMetadataByFileName(fileName);
      this.logger.warn({ fileName, fn: 'update' }, 'File not found on disk');
      throw new VideoStorageServiceError(404, 'File not found on disk');
    }

    const result = this.updateIsActive(fileName, isActive);

    this.logger.info(
      { fileName, isActive, fn: 'update' },
      'Video updated successfully',
    );
    return result;
  }

  async delete(fileName: string) {
    this.removeVideoMetadataByFileName(fileName);
    await super.remove(fileName);
    this.logger.info({ fileName, fn: 'delete' }, 'Video deleted successfully');
  }

  async getVideoMetadata(fileName: string): Promise<VideoMetadata> {
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
      isActive: false,
      createdAt: fileStats.birthtime.getTime(),
    };
  }

  listVideosWithMetadata(): VideoMetadata[] {
    return this.db.select().from(videosTable).all();
  }

  listActiveVideos(): VideoMetadata[] {
    return this.db
      .select()
      .from(videosTable)
      .where(eq(videosTable.isActive, true))
      .all();
  }

  saveVideoMetadata(meta: VideoMetadata): string {
    this.logger.debug(
      { meta, fn: 'saveVideoMetadata' },
      'Saving video metadata',
    );

    try {
      const { fileName } = this.db
        .insert(videosTable)
        .values(meta)
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

  updateIsActive(fileName: string, isActive: boolean): boolean {
    this.logger.debug(
      { fileName, isActive, fn: 'updateIsActive' },
      'Updating video metadata',
    );

    try {
      const meta = this.db
        .update(videosTable)
        .set({ isActive })
        .where(eq(videosTable.fileName, fileName))
        .returning()
        .get();

      if (!meta) {
        this.logger.warn({ fileName, fn: 'updateIsActive' }, 'Video not found');
        throw new VideoStorageServiceError(404, 'Video not found');
      }

      this.logger.info(
        { fileName, isActive, fn: 'updateIsActive' },
        'Video metadata updated successfully',
      );
      return meta.isActive;
    } catch (error) {
      this.logger.error(
        { error, fn: 'updateIsActive' },
        'Error updating video metadata',
      );
      throw new VideoStorageServiceError(500, 'Error updating video metadata');
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
    const existing = new Set(
      this.listVideosWithMetadata().map((v) => v.fileName),
    );

    for (const file of files) {
      if (!existing.has(file)) {
        const meta = await this.getVideoMetadata(file);
        this.saveVideoMetadata(meta);
      }
    }

    for (const video of this.listVideosWithMetadata()) {
      if (!files.includes(video.fileName)) {
        this.removeVideoMetadataByFileName(video.fileName);
      }
    }
  }
}
