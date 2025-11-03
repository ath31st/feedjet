import { FileStorageService } from './file.storage.service.js';
import type { BirthdayService } from './birthday.service.js';
import type { Birthday, NewBirthday } from '@shared/types/birthdays.js';
import { webReadableToNode } from '../utils/stream.js';
import { BirthdayError } from '../errors/birthday.error.js';
import Logger from '../utils/logger.js';
import { parseOdtTable } from '../utils/odt.table.parser.js';
import { parse, isValid } from 'date-fns';

export class BirthdayFileService extends FileStorageService {
  private readonly birthdayService: BirthdayService;
  private readonly defaultDateFormat = 'dd.MM.yyyy';

  constructor(birthdayService: BirthdayService, baseDir: string) {
    super(baseDir);
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
      const birthdays = this.birthdayService.purgeAndInsert(parsed);

      await this.remove(filename);

      return birthdays;
    } catch (err: unknown) {
      Logger.error(err);
      if (err instanceof BirthdayError) {
        throw err;
      }
      throw new BirthdayError(500, 'Failed to upload or parse file');
    } finally {
      await this.remove(file.name);
    }
  }
}
