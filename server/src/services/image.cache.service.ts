import sharp from 'sharp';
import axios from 'axios';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import logger from '../utils/pino.logger.js';

export class ImageCacheService {
  private cacheDir: string;
  private processingMap = new Map<
    string,
    Promise<{ buffer: Buffer; fileName: string }>
  >();

  constructor(cacheDir: string) {
    this.cacheDir = cacheDir;
  }

  getCacheDir() {
    return this.cacheDir;
  }

  private async getCachePath(key: string) {
    const hash = createHash('sha1').update(key).digest('hex');
    const fileName = `${hash}.webp`;
    const cachePath = `${this.cacheDir}/${fileName}`;
    return { cachePath, fileName };
  }

  async process(url: string, width: number) {
    const key = `${url}|${width}`;
    const existing = this.processingMap.get(key);
    if (existing) {
      logger.trace({ url, width }, 'Image processing already in progress');
      return existing;
    }

    const promise = this.processInternal(url, width).finally(() => {
      this.processingMap.delete(key);
    });

    this.processingMap.set(key, promise);
    return promise;
  }

  private async processInternal(url: string, width: number) {
    const { cachePath, fileName } = await this.getCachePath(url + width);

    try {
      const buf = await fs.readFile(cachePath);
      logger.debug({ cachePath }, 'Cache hit for image');
      return { buffer: buf, fileName };
    } catch {
      logger.trace({ cachePath }, 'Cache miss, downloading image');
    }

    try {
      const resp = await axios.get<ArrayBuffer>(url, {
        responseType: 'arraybuffer',
        timeout: 5000,
      });
      logger.debug({ url, width }, 'Image downloaded successfully');

      const buffer = Buffer.from(resp.data);
      const webpBuffer = await sharp(buffer)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      await fs.writeFile(cachePath, webpBuffer);
      logger.info({ url, width, cachePath }, 'Image processed and cached');

      return { buffer: webpBuffer, fileName };
    } catch (err) {
      logger.error({ err, url, width }, 'Failed to process image');
      throw err;
    }
  }
}
