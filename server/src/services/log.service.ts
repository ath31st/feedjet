import { join } from 'node:path';
import fs from 'node:fs';
import readline from 'node:readline';
import type { LogFilter, LogItem, LogPage } from '@shared/types/log.js';

export class LogService {
  private readonly baseDir = join('logs');
  private readonly pageSize = 20;

  private getLogFiles(descending: boolean = true): string[] {
    if (!fs.existsSync(this.baseDir)) return [];

    let files = fs
      .readdirSync(this.baseDir)
      .filter(
        (f) =>
          /^app\.\d{4}-\d{2}-\d{2}(\.\d+)?\.log$/.test(f) ||
          f === 'current.log',
      );

    const hasCurrent = files.includes('current.log');
    if (hasCurrent) {
      files = ['current.log', ...files.filter((f) => f !== 'current.log')];
    }

    if (!descending) {
      files.reverse();
    }

    return files;
  }

  async getLogPage(
    cursor?: string,
    filter: LogFilter = {},
    limit = this.pageSize,
  ): Promise<LogPage> {
    const files = this.getLogFiles();
    if (files.length === 0) return { logs: [] };

    const logs: LogItem[] = [];
    let nextCursor: string | undefined;

    let startFileIndex = 0;
    if (cursor) {
      const cursorDate = new Date(cursor).toISOString().slice(0, 10);
      startFileIndex = files.findIndex((f) =>
        f.includes(cursorDate.replace(/-/g, '.')),
      );
      if (startFileIndex === -1) startFileIndex = 0;
    }

    for (let i = startFileIndex; i < files.length && logs.length < limit; i++) {
      const fileName = files[i];
      const actualFileName =
        fileName === 'current.log'
          ? fs.readlinkSync(join(this.baseDir, fileName))
          : fileName;
      const filePath = join(this.baseDir, actualFileName);

      const rl = readline.createInterface({
        input: fs.createReadStream(filePath, { encoding: 'utf8' }),
        crlfDelay: Infinity,
      });

      let skipUntilCursor = i === startFileIndex && cursor !== undefined;

      for await (const line of rl) {
        if (line.trim() === '') continue;

        let parsed: unknown;
        try {
          parsed = JSON.parse(line);
        } catch {
          continue;
        }

        const log = parsed as LogItem;

        if (
          typeof log.time !== 'string' ||
          typeof log.level !== 'number' ||
          typeof log.source !== 'string'
        ) {
          continue;
        }

        const logTime = log.time;

        if (skipUntilCursor && cursor && new Date(logTime) > new Date(cursor)) {
          continue;
        }
        skipUntilCursor = false;

        if (filter.level && log.level !== filter.level) continue;
        if (filter.source && log.source !== filter.source) continue;
        if (
          filter.search &&
          !JSON.stringify(log)
            .toLowerCase()
            .includes(filter.search.toLowerCase())
        ) {
          continue;
        }

        logs.push(log);

        if (logs.length === limit) {
          nextCursor = logTime;
          rl.close();
          break;
        }
      }

      if (logs.length === limit) break;
    }

    return { logs, nextCursor };
  }
}
