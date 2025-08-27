import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { FileStorageService } from './file.storage.service.js';
import type { VideoMetadata } from '@shared/types/video.js';
import path from 'node:path';

const execFileAsync = promisify(execFile);

export class VideoStorageService extends FileStorageService {
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

  async listVideosWithMetadata() {
    const files = await this.listFiles();
    const result: VideoMetadata[] = [];

    for (const file of files) {
      try {
        const meta = await this.getVideoMetadata(file);
        result.push(meta);
      } catch {}
    }

    return result;
  }
}
