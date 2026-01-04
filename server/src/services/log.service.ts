import type { LogFilter, LogItem, LogPage } from '@shared/types/log.js';
import fs from 'node:fs';
import { join } from 'node:path';
import { LogServiceError } from '../errors/log.service.error.js';

export class LogService {
  private readonly baseDir = join('logs');
  private readonly CHUNK_SIZE = 64 * 1024;

  getLogFiles(): string[] {
    if (!fs.existsSync(this.baseDir)) return [];

    return fs
      .readdirSync(this.baseDir)
      .filter((f) => f.endsWith('.log'))
      .sort((a, b) => b.localeCompare(a));
  }

  getLogPageByFile(
    file: string = 'current.log',
    page: number = 0,
    pageSize: number = 20,
    filter: LogFilter = {},
  ): LogPage {
    const filePath = join(this.baseDir, file);
    if (!fs.existsSync(filePath)) {
      throw new LogServiceError(404, 'Log file not found');
    }

    const need = (page + 1) * pageSize + 1;
    const all = this.readLastNLines(filePath, need, filter);

    const start = page * pageSize;
    const logs = all.slice(start, start + pageSize);

    const hasNext = all.length > start + pageSize;
    const hasPrev = page > 0;

    return {
      logs,
      page,
      pageSize,
      hasPrev,
      hasNext,
    };
  }

  private readLastNLines(
    filePath: string,
    limit: number,
    filter: LogFilter,
  ): LogItem[] {
    const fd = fs.openSync(filePath, 'r');
    const stat = fs.statSync(filePath);

    let position = stat.size;
    let buffer = '';
    const items: LogItem[] = [];

    try {
      while (position > 0 && items.length < limit) {
        const size = Math.min(this.CHUNK_SIZE, position);
        position -= size;

        const buf = Buffer.alloc(size);
        fs.readSync(fd, buf, 0, size, position);

        buffer = buf.toString('utf8') + buffer;
        const lines = buffer.split('\n');
        buffer = lines.shift() ?? '';

        for (let i = lines.length - 1; i >= 0; i--) {
          if (items.length >= limit) break;

          const line = lines[i].trim();
          if (!line) continue;

          try {
            const log = JSON.parse(line);
            if (this.applyFilter(log, filter)) {
              items.push(log);
            }
          } catch {}
        }
      }
    } finally {
      fs.closeSync(fd);
    }

    return items;
  }

  private applyFilter(log: LogItem, filter: LogFilter): boolean {
    if (filter.level && log.level !== filter.level) return false;
    if (filter.search) {
      const s = filter.search.toLowerCase();
      if (!JSON.stringify(log).toLowerCase().includes(s)) return false;
    }
    return true;
  }
}
