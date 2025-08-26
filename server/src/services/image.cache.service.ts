import sharp from 'sharp';
import axios from 'axios';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';

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
      return { buffer: buf, fileName };
    } catch {}

    const resp = await axios.get<ArrayBuffer>(url, {
      responseType: 'arraybuffer',
      timeout: 5000,
    });
    const buffer = Buffer.from(resp.data);

    const webpBuffer = await sharp(buffer)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    await fs.writeFile(cachePath, webpBuffer);
    return { buffer: webpBuffer, fileName };
  }
}
