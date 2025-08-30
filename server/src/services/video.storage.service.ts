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

const execFileAsync = promisify(execFile);

export class VideoStorageService extends FileStorageService {
  private readonly db: DbType;

  constructor(db: DbType, baseDir: string) {
    super(baseDir);
    this.db = db;
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

    return { path: savedPath, savedFileName };
  }

  async update(fileName: string, isActive: boolean): Promise<boolean> {
    const filePath = this.getFilePath(fileName);
    const fileExists = await this.exists(filePath);

    if (!fileExists) {
      this.removeVideoMetadataByFileName(fileName);
      throw new VideoStorageServiceError(404, 'File not found on disk');
    }

    return this.updateIsActive(fileName, isActive);
  }

  async delete(fileName: string) {
    this.removeVideoMetadataByFileName(fileName);
    await super.remove(fileName);
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
    const { fileName } = this.db
      .insert(videosTable)
      .values(meta)
      .returning({ fileName: videosTable.fileName })
      .get();

    return fileName;
  }

  updateIsActive(fileName: string, isActive: boolean): boolean {
    const meta = this.db
      .update(videosTable)
      .set({ isActive })
      .where(eq(videosTable.fileName, fileName))
      .returning()
      .get();

    if (!meta) {
      throw new VideoStorageServiceError(404, 'Video not found');
    }

    return meta.isActive;
  }

  removeVideoMetadataByFileName(fileName: string) {
    this.db.delete(videosTable).where(eq(videosTable.fileName, fileName)).run();
  }

  findVideoMetadataByFileName(fileName: string): VideoMetadata | undefined {
    return this.db
      .select()
      .from(videosTable)
      .where(eq(videosTable.fileName, fileName))
      .get();
  }
}
