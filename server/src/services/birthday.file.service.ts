import { FileStorageService } from './file.storage.service.js';
import type { BirthdayService } from './birthday.service.js';
import type { Birthday, NewBirthday } from '@shared/types/birthdays.js';
import { webReadableToNode } from '../utils/stream.js';
import { BirthdayError } from '../errors/birthday.error.js';
import { parseOdtTable } from '../utils/odt.table.parser.js';
import { parseDocxTable } from '../utils/docx.table.parser.js';
import { parseDocTable } from '../utils/doc.table.parser.js';
import { parse, isValid } from 'date-fns';
import { extname } from 'node:path';

export class BirthdayFileService extends FileStorageService {
  private readonly birthdayService: BirthdayService;
  private readonly defaultDateFormat = 'dd.MM.yyyy';

  constructor(
    birthdayService: BirthdayService,
    baseDir: string,
    loggerName: string = 'birthdayFileService',
  ) {
    super(baseDir, loggerName);
    this.birthdayService = birthdayService;
  }

  private async uploadFile(file: File): Promise<{ path: string }> {
    const nodeStream = webReadableToNode(file.stream());
    const path = await this.saveStream(nodeStream, file.name);

    return { path };
  }

  private async parseUploadedFile(
    filename: string,
    dateFormat?: string,
  ): Promise<NewBirthday[]> {
    const buffer = await this.readFile(filename);
    const parsed = await this.parseBirthdayFile(buffer, filename, dateFormat);

    return parsed;
  }

  private async parseBirthdayFile(
    buffer: Buffer,
    filename: string,
    dateFormat: string = this.defaultDateFormat,
  ): Promise<NewBirthday[]> {
    const rows = await this.parseTableRows(buffer, filename);
    const birthdays: NewBirthday[] = [];

    for (const cells of rows) {
      const mapped = this.mapRowToBirthday(cells, dateFormat);
      if (mapped) birthdays.push(mapped);
    }

    if (birthdays.length === 0) {
      throw new BirthdayError(
        400,
        'No birthday rows found in the uploaded file',
      );
    }

    return birthdays;
  }

  private async parseTableRows(
    buffer: Buffer,
    filename: string,
  ): Promise<string[][]> {
    const ext = extname(filename).toLowerCase();

    switch (ext) {
      case '.odt':
        return parseOdtTable(buffer);
      case '.docx':
        return parseDocxTable(buffer);
      case '.doc':
        return parseDocTable(buffer);
      default:
        throw new BirthdayError(
          400,
          `Unsupported file type: ${ext || '(none)'}. Use .odt, .docx or .doc`,
        );
    }
  }

  private mapRowToBirthday(
    cells: string[],
    dateFormat: string,
  ): NewBirthday | null {
    const dateColIndex = cells.findIndex((cell) =>
      isValid(parse(cell, dateFormat, new Date())),
    );

    if (dateColIndex === -1) return null;

    const birthDate = this.parseDate(cells[dateColIndex], dateFormat);
    const others = cells
      .filter((_, i) => i !== dateColIndex)
      .map((c) => c.trim())
      .filter(Boolean);

    const fullName = others[0];
    if (!fullName) return null;

    const department = others[1] || undefined;

    return { fullName, department, birthDate };
  }

  parseDate(
    dateStr: string,
    dateFormat: string = this.defaultDateFormat,
  ): Date {
    const parsed = parse(dateStr, dateFormat, new Date());

    if (Number.isNaN(parsed.getTime())) {
      this.logger.warn(
        { dateStr, dateFormat, fn: 'parseDate' },
        'Invalid date',
      );
      throw new BirthdayError(400, `Invalid date: ${dateStr}`);
    }

    return parsed;
  }

  async handleUpload(
    file: File,
    lastDays: number,
    dateFormat?: string,
  ): Promise<Birthday[]> {
    try {
      await this.uploadFile(file);
      const filename = file.name;
      const parsed = await this.parseUploadedFile(filename, dateFormat);

      this.logger.debug(
        {
          fileName: filename,
          lastDays,
          parsedCount: parsed.length,
          fn: 'handleUpload',
        },
        'Parsed birthdays from file',
      );

      const birthdays = this.birthdayService.purgeAndInsert(parsed, lastDays);

      this.logger.info(
        { fileName: filename, inserted: birthdays.length, fn: 'handleUpload' },
        'Birthdays inserted successfully',
      );

      await this.remove(filename);
      this.logger.debug(
        { fileName: filename, fn: 'handleUpload' },
        'Temporary file removed after processing',
      );

      return birthdays;
    } catch (err: unknown) {
      this.logger.error(
        { err, fileName: file.name, fn: 'handleUpload' },
        'Failed to upload or parse file',
      );
      if (err instanceof BirthdayError) {
        throw err;
      }
      throw new BirthdayError(500, 'Failed to upload or parse file');
    } finally {
      await this.remove(file.name);
    }
  }
}
