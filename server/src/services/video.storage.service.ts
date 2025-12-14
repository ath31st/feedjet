import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { FileStorageService } from './file.storage.service.js';
import type {
  AdminVideoInfo,
  KioskVideoInfo,
  VideoMetadata,
  VideoOrderUpdate,
} from '@shared/types/video.js';
import path from 'node:path';
import type { DbType } from '../container.js';
import { kioskVideosTable, videosTable } from '../db/schema.js';
import { eq, and, asc, sql } from 'drizzle-orm';
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

  async update(
    fileName: string,
    kioskId: number,
    isActive: boolean,
  ): Promise<boolean> {
    this.logger.debug({ fileName, isActive, fn: 'update' }, 'Updating video');

    const videoId = this.db
      .select()
      .from(videosTable)
      .where(eq(videosTable.fileName, fileName))
      .get()?.id;

    if (!videoId) {
      this.logger.warn({ fileName, fn: 'update' }, 'Video not found');
      throw new VideoStorageServiceError(404, 'Video not found');
    }

    const filePath = this.getFilePath(fileName);
    const fileExists = await this.exists(filePath);

    if (!fileExists) {
      this.removeVideoMetadataByFileName(fileName);
      this.logger.warn({ fileName, fn: 'update' }, 'File not found on disk');
      throw new VideoStorageServiceError(404, 'File not found on disk');
    }

    const result = this.updateIsActive(videoId, kioskId, isActive);

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

  listAdminVideos(kioskId: number): AdminVideoInfo[] {
    return this.db
      .select({
        ...this.videoSelect(),
        isActive: kioskVideosTable.isActive,
        order: kioskVideosTable.order,
      })
      .from(videosTable)
      .leftJoin(
        kioskVideosTable,
        and(
          eq(videosTable.id, kioskVideosTable.videoId),
          eq(kioskVideosTable.kioskId, kioskId),
        ),
      )
      .orderBy(
        asc(sql`COALESCE(${kioskVideosTable.order}, 0)`),
        asc(videosTable.id),
      )
      .all();
  }

  listActiveVideosByKiosk(kioskId: number): KioskVideoInfo[] {
    return this.db
      .select({
        ...this.videoSelect(),
        isActive: kioskVideosTable.isActive,
        order: kioskVideosTable.order,
      })
      .from(videosTable)
      .innerJoin(kioskVideosTable, eq(videosTable.id, kioskVideosTable.videoId))
      .where(
        and(
          eq(kioskVideosTable.kioskId, kioskId),
          eq(kioskVideosTable.isActive, true),
        ),
      )
      .orderBy(asc(kioskVideosTable.order))
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

  updateIsActive(videoId: number, kioskId: number, isActive: boolean): boolean {
    this.logger.debug(
      { videoId, kioskId, isActive, fn: 'updateIsActive' },
      'Updating video metadata',
    );

    try {
      this.db
        .insert(kioskVideosTable)
        .values({ videoId, kioskId, isActive })
        .onConflictDoUpdate({
          target: [kioskVideosTable.kioskId, kioskVideosTable.videoId],
          set: { isActive },
        })
        .run();

      this.logger.info(
        { videoId, kioskId, isActive, fn: 'updateIsActive' },
        'Kiosk video metadata upserted successfully',
      );

      return isActive;
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

  async updateVideoOrderBatch(
    kioskId: number,
    updates: VideoOrderUpdate[],
  ): Promise<void> {
    this.logger.debug(
      { kioskId, updates, fn: 'updateVideoOrderBatch' },
      'Starting batch order update for kiosk videos',
    );

    try {
      await this.db.transaction(async (tx) => {
        for (const { fileName, order } of updates) {
          const videoRow = tx
            .select({ id: videosTable.id })
            .from(videosTable)
            .where(eq(videosTable.fileName, fileName))
            .get();

          if (!videoRow) {
            this.logger.warn(
              { fileName, fn: 'updateVideoOrderBatch' },
              'Video file not found in metadata table. Skipping.',
            );
            continue;
          }

          const videoId = videoRow.id;

          tx.insert(kioskVideosTable)
            .values({ videoId, kioskId, isActive: false, order })
            .onConflictDoUpdate({
              target: [kioskVideosTable.kioskId, kioskVideosTable.videoId],
              set: { order: order },
            })
            .run();
        }
      });

      this.logger.info(
        { kioskId, updatesCount: updates.length, fn: 'updateVideoOrderBatch' },
        'Batch order update completed successfully',
      );
    } catch (error) {
      this.logger.error(
        { error, kioskId, fn: 'updateVideoOrderBatch' },
        'Error performing batch order update',
      );
      throw new VideoStorageServiceError(
        500,
        'Error updating video order batch',
      );
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

  private videoSelect() {
    return {
      id: videosTable.id,
      name: videosTable.name,
      fileName: videosTable.fileName,
      format: videosTable.format,
      duration: videosTable.duration,
      width: videosTable.width,
      height: videosTable.height,
      size: videosTable.size,
      createdAt: videosTable.createdAt,
      mtime: videosTable.mtime,
    };
  }
}
