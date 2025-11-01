import AdmZip from 'adm-zip';

export async function parseOdtFile(buffer: Buffer): Promise<string> {
  try {
    const zip = new AdmZip(buffer);
    const entry = zip.getEntry('content.xml');
    if (!entry) throw new Error('ODT file is missing content.xml');

    const xml = entry.getData().toString('utf-8');

    const text = xml
      .replace(/<text:line-break\/>/g, '\n') // переносы строк
      .replace(/<\/text:p>/g, '\n') // абзацы
      .replace(/<[^>]+>/g, '') // все остальные теги
      .replace(/\s+\n/g, '\n') // пробелы
      .trim();

    return text;
  } catch (err) {
    throw new Error(`Failed to parse ODT file: ${(err as Error).message}`);
  }
}
