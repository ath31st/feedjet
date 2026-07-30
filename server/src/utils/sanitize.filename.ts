import crypto from 'node:crypto';
import path from 'node:path';

const UNSAFE_CHARS = /[<>:"/\\|?*#%&+?=;@^]/g;

function replaceControlChars(value: string): string {
  return [...value]
    .map((ch) => {
      const code = ch.codePointAt(0) ?? 0;
      return code < 32 || code === 127 ? '_' : ch;
    })
    .join('');
}

/**
 * Makes a filename safe for disk storage and URL path segments.
 * Strips directories, replaces reserved/unsafe characters.
 * Keeps letters (incl. non-ASCII), digits, `.`, `-`, `_`.
 */
export function sanitizeFileName(fileName: string): string {
  const base = path.basename(fileName);
  const ext = path.extname(base);
  let name = path.basename(base, ext);

  name = replaceControlChars(name)
    .replace(UNSAFE_CHARS, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^[._]+|[._]+$/g, '');

  if (!name) {
    name = `file_${crypto.randomBytes(4).toString('hex')}`;
  }

  return `${name}${ext}`;
}
