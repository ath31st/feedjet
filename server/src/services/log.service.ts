import type {
  LogFilter,
  LogItem,
  LogLevel,
  LogPage,
} from '@shared/types/log.js';
import {
  open,
  readdir,
  readFile,
  unlink,
  access,
  constants,
} from 'node:fs/promises';
import { join } from 'node:path';
import { LogServiceError } from '../errors/log.service.error.js';

export class LogService {
  private readonly baseDir = join('logs');
  private readonly CHUNK_SIZE = 64 * 1024;

  async getLogFiles(): Promise<string[]> {
    if (!(await this.dirExists())) return [];

    const files = await readdir(this.baseDir);
    return files
      .filter((f) => f.endsWith('.log'))
      .sort((a, b) => {
        if (a === 'current.log') return -1;
        if (b === 'current.log') return 1;
        return b.localeCompare(a);
      });
  }

  async getLogSources(file: string = 'current.log'): Promise<string[]> {
    this.assertSafeFileName(file);
    const filePath = join(this.baseDir, file);
    if (!(await this.fileExists(filePath))) {
      throw new LogServiceError(404, 'Log file not found');
    }

    const sources = new Set<string>();
    // Recent slice is enough for the source dropdown; avoids full-file scans.
    const items = await this.readLastNLines(filePath, 10_000, {});

    for (const log of items) {
      if (log.source) sources.add(log.source);
    }

    return [...sources].sort((a, b) => a.localeCompare(b));
  }

  async getLogPageByFile(
    file: string = 'current.log',
    page: number = 0,
    pageSize: number = 20,
    filter: LogFilter = {},
  ): Promise<LogPage> {
    this.assertSafeFileName(file);
    const filePath = join(this.baseDir, file);
    if (!(await this.fileExists(filePath))) {
      throw new LogServiceError(404, 'Log file not found');
    }

    const need = (page + 1) * pageSize + 1;
    const all = await this.readLastNLines(filePath, need, filter);

    const start = page * pageSize;
    const logs = all.slice(start, start + pageSize);

    return {
      logs,
      page,
      pageSize,
      hasPrev: page > 0,
      hasNext: all.length > start + pageSize,
    };
  }

  async readLogFileContent(file: string): Promise<string> {
    this.assertSafeFileName(file);
    const filePath = join(this.baseDir, file);
    if (!(await this.fileExists(filePath))) {
      throw new LogServiceError(404, 'Log file not found');
    }
    return readFile(filePath, 'utf8');
  }

  async deleteLogFiles(daysToKeep: number): Promise<{ deleted: number }> {
    if (!(await this.dirExists())) {
      return { deleted: 0 };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cutoffDate = new Date(today);
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const files = await readdir(this.baseDir);
    let deleted = 0;

    for (const file of files) {
      if (!file.endsWith('.log')) continue;

      const dateMatch = file.match(/(\d{4}-\d{2}-\d{2})/);
      if (!dateMatch) continue;

      const fileDate = new Date(dateMatch[1]);
      fileDate.setHours(0, 0, 0, 0);

      if (fileDate < cutoffDate) {
        await unlink(join(this.baseDir, file));
        deleted += 1;
      }
    }

    return { deleted };
  }

  private async readLastNLines(
    filePath: string,
    limit: number,
    filter: LogFilter,
  ): Promise<LogItem[]> {
    const fd = await open(filePath, 'r');
    const stat = await fd.stat();

    let position = stat.size;
    let buffer = '';
    const items: LogItem[] = [];

    try {
      while (position > 0 && items.length < limit) {
        const size = Math.min(this.CHUNK_SIZE, position);
        position -= size;

        const buf = Buffer.alloc(size);
        await fd.read(buf, 0, size, position);

        buffer = buf.toString('utf8') + buffer;
        const lines = buffer.split('\n');
        buffer = lines.shift() ?? '';

        for (let i = lines.length - 1; i >= 0; i--) {
          if (items.length >= limit) break;

          const line = lines[i].trim();
          if (!line) continue;

          try {
            const log = JSON.parse(line) as LogItem;
            if (this.applyFilter(log, filter)) {
              items.push(log);
            }
          } catch {
            // skip malformed lines
          }
        }
      }
    } finally {
      await fd.close();
    }

    return items;
  }

  private applyFilter(log: LogItem, filter: LogFilter): boolean {
    if (
      filter.levels?.length &&
      !filter.levels.includes(log.level as LogLevel)
    ) {
      return false;
    }

    if (filter.source && log.source !== filter.source) {
      return false;
    }

    if (filter.search) {
      const s = filter.search.toLowerCase();
      if (!JSON.stringify(log).toLowerCase().includes(s)) return false;
    }

    return true;
  }

  private assertSafeFileName(file: string) {
    if (
      file.includes('..') ||
      file.includes('/') ||
      file.includes('\\') ||
      !file.endsWith('.log')
    ) {
      throw new LogServiceError(400, 'Invalid log file name');
    }
  }

  private async dirExists(): Promise<boolean> {
    try {
      await access(this.baseDir, constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await access(filePath, constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }
}
