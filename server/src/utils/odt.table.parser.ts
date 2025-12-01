import AdmZip from 'adm-zip';
import type { IZipEntry } from 'adm-zip';
import { XMLParser } from 'fast-xml-parser';
import { FileStorageError } from '../errors/file.storage.error.js';

type TextNode = { '#text': string } | string;
type TextNodes = TextNode | TextNode[];

interface TableCell {
  p?: TextNodes;
}

interface TableRow {
  'table-cell'?: TableCell | TableCell[];
}

interface Table {
  'table-row'?: TableRow | TableRow[];
}

interface ParsedXml {
  'document-content'?: {
    body?: { text?: { table?: Table | Table[] } };
  };
}

export async function parseOdtTable(buffer: Buffer): Promise<string[]> {
  const zip = new AdmZip(buffer);
  const entry: IZipEntry | null = zip.getEntry('content.xml');

  if (!entry)
    throw new FileStorageError(400, 'ODT file is missing content.xml');

  const xml: string = entry.getData().toString('utf-8');

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    removeNSPrefix: true,
    trimValues: false,
  });

  const parsed = parser.parse(xml) as ParsedXml;
  const tables = parsed['document-content']?.body?.text?.table;

  if (!tables) throw new FileStorageError(400, 'No tables found in ODT');

  const firstTable: Table = Array.isArray(tables) ? tables[0] : tables;
  const rows = firstTable['table-row'];

  if (!rows) throw new FileStorageError(400, 'No rows in table');

  const result: string[] = [];
  const rowArray: TableRow[] = Array.isArray(rows) ? rows : [rows];

  for (const row of rowArray) {
    const cells = row['table-cell'];

    if (!cells) continue;

    const cellArray: TableCell[] = Array.isArray(cells) ? cells : [cells];
    const values: string[] = [];

    for (const cell of cellArray) {
      const cellText = extractCellText(cell.p);
      values.push(cellText);
    }

    const line: string = values.filter(Boolean).join(' ').trim();

    if (line) result.push(line);
  }
  return result;
}

// biome-ignore lint/suspicious/noExplicitAny: parsing unknown xml structure
function extractCellText(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractCellText).join('');

  let text = '';
  if ('#text' in node) text += node['#text'];
  if ('s' in node) text += ' ';
  if ('span' in node) text += extractCellText(node.span);

  return text;
}
