import { FileStorageService } from './file.storage.service.js';
import type { BirthdayService } from './birthday.service.js';
import type { Birthday, NewBirthday } from '@shared/types/birthdays.js';
import { webReadableToNode } from '../utils/stream.js';
import { BirthdayError } from '../errors/birthday.error.js';
import { parseOdtTable } from '../utils/odt.table.parser.js';
import { parse, isValid } from 'date-fns';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import logger from '../utils/pino.logger.js';

export class BirthdayFileService extends FileStorageService {
  private readonly birthdayService: BirthdayService;
  private readonly backgroundsDir = 'backgrounds';
  private readonly defaultDateFormat = 'dd.MM.yyyy';

  constructor(birthdayService: BirthdayService, baseDir: string) {
    super(baseDir);
    this.birthdayService = birthdayService;
    fs.mkdir(path.join(this.baseDir, this.backgroundsDir), { recursive: true });
  }

  protected override getFilePath(fileName: string) {
    return path.join(this.baseDir, this.backgroundsDir, fileName);
  }

  override async listFiles() {
    const dir = path.join(this.baseDir, this.backgroundsDir);
    return fs.readdir(dir);
  }

  override getBaseDir() {
    return path.join(this.baseDir, this.backgroundsDir);
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
    const parsed = await this.parseBirthdayFile(buffer, dateFormat);

    return parsed;
  }

  private async parseBirthdayFile(
    buffer: Buffer,
    dateFormat: string = this.defaultDateFormat,
  ): Promise<NewBirthday[]> {
    const text = await parseOdtTable(buffer);
    const lines: string[] = text
      .map((l: string) => l.trim())
      .filter(Boolean)
      .filter((l) => {
        const cells = l.split(/\s+/);
        return cells.some((cell) =>
          isValid(parse(cell, dateFormat, new Date())),
        );
      });

    return lines.map((line) => {
      const [dateStr, ...rest] = line.split(/\s+/);
      const birthDate = this.parseDate(dateStr, dateFormat);
      const [lastName, firstName, middleName, ...deptParts] = rest;
      const department = deptParts.join(' ').trim() || undefined;
      const fullName = [lastName, firstName, middleName].join(' ');

      const newBirthday: NewBirthday = {
        fullName,
        department,
        birthDate,
      };

      return newBirthday;
    });
  }

  parseDate(
    dateStr: string,
    dateFormat: string = this.defaultDateFormat,
  ): Date {
    const parsed = parse(dateStr, dateFormat, new Date());

    if (Number.isNaN(parsed.getTime())) {
      throw new BirthdayError(400, `Invalid date: ${dateStr}`);
    }

    return parsed;
  }

  async handleUpload(file: File, dateFormat?: string): Promise<Birthday[]> {
    try {
      await this.uploadFile(file);
      const filename = file.name;
      const parsed = await this.parseUploadedFile(filename, dateFormat);

      logger.debug(
        { fileName: filename, parsedCount: parsed.length },
        'Parsed birthdays from file',
      );

      const birthdays = this.birthdayService.purgeAndInsert(parsed);

      logger.info(
        { fileName: filename, inserted: birthdays.length },
        'Birthdays inserted successfully',
      );

      await this.remove(filename);
      logger.debug(
        { fileName: filename },
        'Temporary file removed after processing',
      );

      return birthdays;
    } catch (err: unknown) {
      logger.error(
        { err, fileName: file.name },
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
