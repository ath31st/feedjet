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

    const meta = this.findVideoMetadataByFileName(filename);
    if (meta) {
      await this.deleteThumbnailFile(meta.thumbnail);
      this.removeVideoMetadataByFileName(filename);
    }

    const baseMeta = await this.getVideoMetadata(filename);
    const thumbnail = await this.generateThumbnail(filename);
    const savedFileName = this.saveVideoMetadata(
      { ...baseMeta, thumbnail },
      folderId,
    );

    this.logger.info(
      { savedPath, savedFileName, folderId, thumbnail, fn: 'upload' },
      'Video uploaded',
    );
    return { path: savedPath, savedFileName };
  }

  async delete(fileName: string) {
    const meta = this.findVideoMetadataByFileName(fileName);
    if (meta?.thumbnail) {
      await this.deleteThumbnailFile(meta.thumbnail);
    }

    this.removeVideoMetadataByFileName(fileName);
    await super.remove(fileName);
    this.logger.info({ fileName, fn: 'delete' }, 'Video deleted successfully');
  }

  private getThumbnailFileName(fileName: string) {
    const name = path.basename(fileName, path.extname(fileName));
    return `${name}_thumbnail.jpg`;
  }

  private async deleteThumbnailFile(thumbnail: string | null | undefined) {
    if (!thumbnail) return;

    if (await this.exists(this.getFilePath(thumbnail))) {
      await this.remove(thumbnail);
    }
  }

  private async generateThumbnail(fileName: string): Promise<string> {
    const thumbnail = this.getThumbnailFileName(fileName);
    const inputPath = this.getFilePath(fileName);
    const outputPath = this.getFilePath(thumbnail);

    const seekPoints = ['1', '0'];

    for (const ss of seekPoints) {
      try {
        await execFileAsync('ffmpeg', [
          '-y',
          '-ss',
          ss,
          '-i',
          inputPath,
          '-frames:v',
          '1',
          '-vf',
          'scale=-1:150',
          '-q:v',
          '5',
          outputPath,
        ]);

        if (await this.exists(outputPath)) {
          this.logger.info(
            { fileName, thumbnail, ss, fn: 'generateThumbnail' },
            'Video thumbnail generated',
          );
          return thumbnail;
        }
      } catch (error) {
        this.logger.warn(
          { error, fileName, ss, fn: 'generateThumbnail' },
          'Failed to generate video thumbnail at seek point',
        );
      }
    }

    this.logger.error(
      { fileName, fn: 'generateThumbnail' },
      'Could not generate video thumbnail',
    );
    return '';
  }

  private async ensureThumbnail(meta: VideoMetadata): Promise<string> {
    const expected = this.getThumbnailFileName(meta.fileName);

    if (
      meta.thumbnail &&
      (await this.exists(this.getFilePath(meta.thumbnail)))
    ) {
      return meta.thumbnail;
    }

    if (await this.exists(this.getFilePath(expected))) {
      return expected;
    }

    return this.generateThumbnail(meta.fileName);
  }

  private async getVideoMetadata(
    fileName: string,
  ): Promise<Omit<VideoMetadata, 'thumbnail'>> {
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

  private updateVideoThumbnail(fileName: string, thumbnail: string) {
    this.db
      .update(videosTable)
      .set({ thumbnail })
      .where(eq(videosTable.fileName, fileName))
      .run();
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
    const withoutThumbnails = files.filter((f) => !f.includes('_thumbnail'));
    const existing = new Set(this.listVideoMetadata().map((v) => v.fileName));

    for (const file of withoutThumbnails) {
      if (!existing.has(file)) {
        const baseMeta = await this.getVideoMetadata(file);
        const thumbnail = await this.generateThumbnail(file);
        this.saveVideoMetadata({ ...baseMeta, thumbnail });
      }
    }

    for (const video of this.listVideoMetadata()) {
      if (!withoutThumbnails.includes(video.fileName)) {
        await this.deleteThumbnailFile(video.thumbnail);
        this.removeVideoMetadataByFileName(video.fileName);
        continue;
      }

      const thumbnail = await this.ensureThumbnail(video);
      if (thumbnail !== video.thumbnail) {
        this.updateVideoThumbnail(video.fileName, thumbnail);
        this.logger.info(
          { fileName: video.fileName, thumbnail, fn: 'syncWithDisk' },
          'Video thumbnail backfilled',
        );
      }
    }
  }
}
