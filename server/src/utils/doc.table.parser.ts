import WordExtractor from 'word-extractor';
import { FileStorageError } from '../errors/file.storage.error.js';

/**
 * Binary .doc tables are exposed by word-extractor as tab-separated lines.
 * Non-table prose is ignored later by date-column detection.
 */
export async function parseDocTable(buffer: Buffer): Promise<string[][]> {
  try {
    const extractor = new WordExtractor();
    const document = await extractor.extract(buffer);
    const body = document.getBody();

    if (!body?.trim()) {
      throw new FileStorageError(400, 'DOC file has no readable text');
    }

    const rows: string[][] = [];

    for (const line of body.split(/\r?\n/)) {
      if (!line.includes('\t')) continue;

      const cells = line.split('\t').map((c) => c.replace(/\s+/g, ' ').trim());

      while (cells.length > 0 && cells[cells.length - 1] === '') cells.pop();

      if (cells.some((c) => c.length > 0)) rows.push(cells);
    }

    if (rows.length === 0) {
      throw new FileStorageError(400, 'No table rows found in DOC');
    }

    return rows;
  } catch (err: unknown) {
    if (err instanceof FileStorageError) throw err;
    throw new FileStorageError(400, 'Failed to parse DOC file');
  }
}
