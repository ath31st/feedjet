import AdmZip from 'adm-zip';
import type { IZipEntry } from 'adm-zip';
import { XMLParser } from 'fast-xml-parser';

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

  if (!entry) throw new Error('ODT file is missing content.xml');

  const xml: string = entry.getData().toString('utf-8');

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    removeNSPrefix: true,
    trimValues: false,
  });

  const parsed = parser.parse(xml) as ParsedXml;
  const tables = parsed['document-content']?.body?.text?.table;

  if (!tables) throw new Error('No tables found in ODT');

  const firstTable: Table = Array.isArray(tables) ? tables[0] : tables;
  const rows = firstTable['table-row'];

  if (!rows) throw new Error('No rows in table');

  const result: string[] = [];
  const rowArray: TableRow[] = Array.isArray(rows) ? rows : [rows];

  for (const row of rowArray) {
    const cells = row['table-cell'];
    if (!cells) continue;

    const cellArray: TableCell[] = Array.isArray(cells) ? cells : [cells];
    const values: string[] = [];

    for (const cell of cellArray) {
      const texts = cell.p;
      if (!texts) continue;

      if (Array.isArray(texts)) {
        values.push(
          ...texts.map((t) =>
            (typeof t === 'string' ? t : t['#text'] || '').trim(),
          ),
        );
      } else {
        values.push(
          (typeof texts === 'string' ? texts : texts['#text'] || '').trim(),
        );
      }
    }

    const line: string = values.filter(Boolean).join(' ').trim();

    if (line) result.push(line);
  }
  return result;
}
