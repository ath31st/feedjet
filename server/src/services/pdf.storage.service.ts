import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { FileStorageService } from './file.storage.service.js';
import type { PdfMetadata } from '@shared/types/pdf.js';
import path from 'node:path';
import type { DbType } from '../container.js';
import { pdfsTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { PdfStorageServiceError } from '../errors/pdf.error.js';
import { webReadableToNode } from '../utils/stream.js';
import { promises as fs } from 'node:fs';
import { sanitizeFileName } from '../utils/sanitize.filename.js';
import sharp from 'sharp';

const execFileAsync = promisify(execFile);

export class PdfStorageService extends FileStorageService {
  private readonly db: DbType;
  private readonly pdfsDir = 'pdfs';
  private readonly maxUploadBytes = 50 * 1024 * 1024;

  constructor(
    db: DbType,
    baseDir: string,
    loggerName: string = 'pdfStorageService',
  ) {
    super(baseDir, loggerName);
    this.db = db;
    fs.mkdir(path.join(this.baseDir, this.pdfsDir), { recursive: true });
  }

  protected override getFilePath(fileName: string) {
    return path.join(this.baseDir, this.pdfsDir, fileName);
  }

  override async listFiles() {
    const dir = path.join(this.baseDir, this.pdfsDir);
    return fs.readdir(dir);
  }

  override getBaseDir() {
    return path.join(this.baseDir, this.pdfsDir);
  }

  async upload(
    file: File,
    filename: string,
    folderId: number | null = null,
  ): Promise<{ path: string; savedFileName: string }> {
    if (file.size > this.maxUploadBytes) {
      throw new PdfStorageServiceError(
        400,
        'PDF file is too large (max 50 MB)',
      );
    }

    const safeFileName = this.ensurePdfFileName(sanitizeFileName(filename));

    const existing = this.findPdfMetadataByFileName(safeFileName);
    if (existing) {
      await this.delete(existing.fileName);
    }

    const nodeStream = webReadableToNode(file.stream());
    const savedPath = await this.saveStream(nodeStream, safeFileName);

    try {
      await this.compressPdfInPlace(safeFileName);
      const baseMeta = await this.getPdfMetadata(safeFileName);
      const thumbnail = await this.generateThumbnail(safeFileName);
      const savedFileName = this.savePdfMetadata(
        { ...baseMeta, thumbnail },
        folderId,
      );

      this.logger.info(
        {
          savedPath,
          savedFileName,
          folderId,
          pageCount: baseMeta.pageCount,
          size: baseMeta.size,
          originalFileName: filename,
          fn: 'upload',
        },
        'PDF uploaded',
      );

      return { path: savedPath, savedFileName };
    } catch (err) {
      await this.remove(safeFileName).catch(() => undefined);
      throw err;
    }
  }

  async delete(fileName: string) {
    const meta = this.findPdfMetadataByFileName(fileName);
    if (meta?.thumbnail) {
      await this.deleteThumbnailFile(meta.thumbnail);
    }

    this.removePdfMetadataByFileName(fileName);
    await super.remove(fileName);
    this.logger.info({ fileName, fn: 'delete' }, 'PDF deleted successfully');
  }

  private ensurePdfFileName(fileName: string) {
    const ext = path.extname(fileName).toLowerCase();
    if (ext !== '.pdf') {
      throw new PdfStorageServiceError(400, 'Only PDF files are allowed');
    }
    return fileName;
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

  private async compressPdfInPlace(fileName: string) {
    const inputPath = this.getFilePath(fileName);
    const tempPath = this.getFilePath(
      `${path.basename(fileName, '.pdf')}.optimized.tmp.pdf`,
    );

    try {
      await execFileAsync('gs', [
        '-sDEVICE=pdfwrite',
        '-dCompatibilityLevel=1.4',
        '-dPDFSETTINGS=/ebook',
        '-dNOPAUSE',
        '-dQUIET',
        '-dBATCH',
        `-sOutputFile=${tempPath}`,
        inputPath,
      ]);

      const [inputStats, outputStats] = await Promise.all([
        fs.stat(inputPath),
        fs.stat(tempPath),
      ]);

      if (outputStats.size < inputStats.size) {
        await fs.rename(tempPath, inputPath);
        this.logger.info(
          {
            fileName,
            beforeSize: inputStats.size,
            afterSize: outputStats.size,
            fn: 'compressPdfInPlace',
          },
          'PDF compressed with Ghostscript',
        );
      } else {
        await fs.unlink(tempPath);
        this.logger.debug(
          { fileName, fn: 'compressPdfInPlace' },
          'Compressed PDF not smaller, keeping original',
        );
      }
    } catch (err) {
      await fs.unlink(tempPath).catch(() => undefined);
      this.logger.error(
        { err, fileName, fn: 'compressPdfInPlace' },
        'Ghostscript PDF compression failed',
      );
      throw new PdfStorageServiceError(500, 'Failed to optimize PDF');
    }
  }

  private async getPageCount(fileName: string): Promise<number> {
    const filePath = this.getFilePath(fileName);

    try {
      const { stdout } = await execFileAsync('gs', [
        '-q',
        '-dNODISPLAY',
        '-dNOSAFER',
        `-sFile=${filePath}`,
        '-c',
        'File (r) file runpdfbegin pdfpagecount = quit',
      ]);

      const count = Number.parseInt(stdout.trim(), 10);
      if (Number.isFinite(count) && count > 0) {
        return count;
      }
    } catch (err) {
      this.logger.warn(
        { err, fileName, fn: 'getPageCount' },
        'Failed to read PDF page count via Ghostscript',
      );
    }

    return 1;
  }

  private async generateThumbnail(fileName: string): Promise<string> {
    const thumbnail = this.getThumbnailFileName(fileName);
    const inputPath = this.getFilePath(fileName);
    const rawThumbPath = this.getFilePath(
      `${path.basename(fileName, '.pdf')}.thumb.tmp.jpg`,
    );
    const outputPath = this.getFilePath(thumbnail);

    try {
      await execFileAsync('gs', [
        '-dSAFER',
        '-dBATCH',
        '-dNOPAUSE',
        '-sDEVICE=jpeg',
        '-dFirstPage=1',
        '-dLastPage=1',
        '-r72',
        '-dJPEGQ=85',
        `-sOutputFile=${rawThumbPath}`,
        inputPath,
      ]);

      await sharp(rawThumbPath)
        .resize({ height: 150, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(outputPath);

      await fs.unlink(rawThumbPath).catch(() => undefined);

      this.logger.info(
        { fileName, thumbnail, fn: 'generateThumbnail' },
        'PDF thumbnail generated',
      );
      return thumbnail;
    } catch (err) {
      await fs.unlink(rawThumbPath).catch(() => undefined);
      this.logger.error(
        { err, fileName, fn: 'generateThumbnail' },
        'Could not generate PDF thumbnail',
      );
      return '';
    }
  }

  private async ensureThumbnail(meta: PdfMetadata): Promise<string> {
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

  private async getPdfMetadata(
    fileName: string,
  ): Promise<Omit<PdfMetadata, 'thumbnail'>> {
    const fileStats = await this.getFileStats(fileName);
    const pageCount = await this.getPageCount(fileName);
    const name = path.basename(fileName, path.extname(fileName));

    return {
      name,
      fileName,
      format: 'pdf',
      pageCount,
      size: fileStats.size,
      mtime: fileStats.mtime.getTime(),
      createdAt: fileStats.birthtime.getTime(),
    };
  }

  private listPdfMetadata(): PdfMetadata[] {
    return this.db.select().from(pdfsTable).all();
  }

  private savePdfMetadata(
    meta: PdfMetadata,
    folderId: number | null = null,
  ): string {
    this.logger.debug(
      { meta, folderId, fn: 'savePdfMetadata' },
      'Saving PDF metadata',
    );

    try {
      const { fileName } = this.db
        .insert(pdfsTable)
        .values({ ...meta, folderId })
        .returning({ fileName: pdfsTable.fileName })
        .get();

      this.logger.info(
        { fileName, fn: 'savePdfMetadata' },
        'PDF metadata saved successfully',
      );
      return fileName;
    } catch (err) {
      this.logger.error(
        { err, fn: 'savePdfMetadata' },
        'Error saving PDF metadata',
      );
      throw new PdfStorageServiceError(500, 'Error saving PDF metadata');
    }
  }

  private updatePdfThumbnail(fileName: string, thumbnail: string) {
    this.db
      .update(pdfsTable)
      .set({ thumbnail })
      .where(eq(pdfsTable.fileName, fileName))
      .run();
  }

  removePdfMetadataByFileName(fileName: string) {
    try {
      this.db.delete(pdfsTable).where(eq(pdfsTable.fileName, fileName)).run();
      this.logger.info(
        { fileName, fn: 'removePdfMetadataByFileName' },
        'PDF metadata removed successfully',
      );
    } catch (err) {
      this.logger.error(
        { err, fn: 'removePdfMetadataByFileName' },
        'Error removing PDF metadata',
      );
      throw new PdfStorageServiceError(500, 'Error removing PDF metadata');
    }
  }

  findPdfMetadataByFileName(fileName: string): PdfMetadata | undefined {
    return this.db
      .select()
      .from(pdfsTable)
      .where(eq(pdfsTable.fileName, fileName))
      .get();
  }

  async syncWithDisk() {
    const files = await this.listFiles();
    const withoutThumbnails = files.filter(
      (f) => !f.includes('_thumbnail') && !f.endsWith('.tmp.pdf') && !f.includes('.thumb.tmp.'),
    );
    const pdfFiles = withoutThumbnails.filter(
      (f) => path.extname(f).toLowerCase() === '.pdf',
    );
    const existing = new Set(this.listPdfMetadata().map((p) => p.fileName));

    for (const file of pdfFiles) {
      if (!existing.has(file)) {
        const baseMeta = await this.getPdfMetadata(file);
        const thumbnail = await this.generateThumbnail(file);
        this.savePdfMetadata({ ...baseMeta, thumbnail });
      }
    }

    for (const pdf of this.listPdfMetadata()) {
      if (!pdfFiles.includes(pdf.fileName)) {
        await this.deleteThumbnailFile(pdf.thumbnail);
        this.removePdfMetadataByFileName(pdf.fileName);
        continue;
      }

      const thumbnail = await this.ensureThumbnail(pdf);
      if (thumbnail !== pdf.thumbnail) {
        this.updatePdfThumbnail(pdf.fileName, thumbnail);
        this.logger.info(
          { fileName: pdf.fileName, thumbnail, fn: 'syncWithDisk' },
          'PDF thumbnail backfilled',
        );
      }
    }
  }
}
