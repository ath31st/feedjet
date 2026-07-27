import AdmZip from 'adm-zip';
import type { IZipEntry } from 'adm-zip';
import { XMLParser } from 'fast-xml-parser';
import { FileStorageError } from '../errors/file.storage.error.js';

/** Ordered node from fast-xml-parser with preserveOrder: true */
type OrderedNode = Record<string, unknown>;

const ATTR_KEY = ':@';
const TEXT_KEY = '#text';
const SPACE_TAG = 's';
const TABLE_TAG = 'table';
const ROW_TAG = 'table-row';
const CELL_TAG = 'table-cell';
const COVERED_CELL_TAG = 'covered-table-cell';

export async function parseOdtTable(buffer: Buffer): Promise<string[][]> {
  const zip = new AdmZip(buffer);
  const entry: IZipEntry | null = zip.getEntry('content.xml');

  if (!entry)
    throw new FileStorageError(400, 'ODT file is missing content.xml');

  const xml: string = entry.getData().toString('utf-8');

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    removeNSPrefix: true,
    trimValues: false,
    preserveOrder: true,
  });

  const parsed = parser.parse(xml) as OrderedNode[];
  const tables = findNodesByTag(parsed, TABLE_TAG);

  if (tables.length === 0)
    throw new FileStorageError(400, 'No tables found in ODT');

  const firstTable = tables[0];
  const rows = firstTable.filter((node) => ROW_TAG in node);

  if (rows.length === 0) throw new FileStorageError(400, 'No rows in table');

  const result: string[][] = [];

  for (const rowWrap of rows) {
    const rowChildren = rowWrap[ROW_TAG] as OrderedNode[];
    const cells: string[] = [];

    for (const child of rowChildren) {
      if (CELL_TAG in child) {
        cells.push(normalizeCellText(extractOrderedText(child[CELL_TAG])));
      } else if (COVERED_CELL_TAG in child) {
        cells.push('');
      }
    }

    if (cells.some((c) => c.length > 0)) result.push(cells);
  }

  return result;
}

function findNodesByTag(nodes: OrderedNode[], tag: string): OrderedNode[][] {
  const found: OrderedNode[][] = [];

  for (const node of nodes) {
    if (tag in node) {
      found.push(node[tag] as OrderedNode[]);
    }

    for (const [key, value] of Object.entries(node)) {
      if (key === ATTR_KEY || key === TEXT_KEY) continue;
      if (Array.isArray(value)) {
        found.push(...findNodesByTag(value as OrderedNode[], tag));
      }
    }
  }

  return found;
}

function extractOrderedText(nodes: unknown): string {
  if (!nodes) return '';
  if (typeof nodes === 'string') return nodes;
  if (!Array.isArray(nodes)) return '';

  let out = '';

  for (const node of nodes as OrderedNode[]) {
    if (TEXT_KEY in node) {
      out += String(node[TEXT_KEY]);
      continue;
    }

    if (SPACE_TAG in node) {
      const attrs = (node[ATTR_KEY] as Record<string, string> | undefined) ?? {};
      const count = Number(attrs['@_c'] ?? 1);
      out += ' '.repeat(Number.isFinite(count) && count > 0 ? count : 1);
      continue;
    }

    const tag = Object.keys(node).find((k) => k !== ATTR_KEY);
    if (tag) out += extractOrderedText(node[tag]);
  }

  return out;
}

function normalizeCellText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}
