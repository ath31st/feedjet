import crypto from 'node:crypto';
import { cryptoConfig as config } from '../config/config.js';

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(config.IV_LENGTH);
  const cipher = crypto.createCipheriv(config.ALGO, config.KEY_BUFFER, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
}

export function decrypt(data: string): string {
  const [ivB64, tagB64, encryptedB64] = data.split(':');
  const iv = Buffer.from(ivB64, 'base64');
  const tag = Buffer.from(tagB64, 'base64');
  const encrypted = Buffer.from(encryptedB64, 'base64');
  const decipher = crypto.createDecipheriv(config.ALGO, config.KEY_BUFFER, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}
