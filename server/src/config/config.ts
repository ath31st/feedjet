import path from 'node:path';
import fs from 'node:fs';
import logger from '../utils/pino.logger.js';

export const dbPath = process.env.DB_FILE_NAME ?? '';
logger.info({ dbPath }, 'Database file path');

if (!dbPath || dbPath === '') {
  logger.error('Error: DB_FILE_NAME environment variable is not set');
  process.exit(1);
}

const resolvedPath = path.resolve(dbPath);
if (!fs.existsSync(resolvedPath)) {
  logger.error({ resolvedPath }, 'Database file does not exist');
  process.exit(1);
}

export const cacheDir = process.env.CACHE_DIR ?? './.image-cache';
if (cacheDir) {
  fs.mkdirSync(cacheDir, { recursive: true });
  logger.info({ cacheDir }, 'Image cache directory created');
}

export const fileStorageDir = process.env.FILE_STORAGE_DIR ?? './file-storage';
if (fileStorageDir) {
  fs.mkdirSync(fileStorageDir, { recursive: true });
  logger.info({ fileStorageDir }, 'File storage directory created');
}

export const openWeatherApiKey = process.env.OPEN_WEATHER_API_KEY;
if (!openWeatherApiKey) {
  logger.error('Error: OPEN_WEATHER_API_KEY environment variable is not set');
  process.exit(1);
}

const dataEncryptionKey = process.env.DATA_ENCRYPTION_KEY ?? '';
if (!dataEncryptionKey) {
  logger.error('Error: DATA_ENCRYPTION_KEY environment variable is not set');
  process.exit(1);
}

let encryptionKeyBuffer: Buffer;
try {
  if (!dataEncryptionKey.startsWith('base64:')) {
    throw new Error('DATA_ENCRYPTION_KEY must start with "base64:"');
  }
  encryptionKeyBuffer = Buffer.from(
    dataEncryptionKey.replace('base64:', ''),
    'base64',
  );
  if (encryptionKeyBuffer.length !== 32) {
    throw new Error(
      `Invalid key length: expected 32 bytes, got ${encryptionKeyBuffer.length}`,
    );
  }
} catch (err: unknown) {
  logger.error({ err }, 'Error parsing DATA_ENCRYPTION_KEY');
  process.exit(1);
}

logger.info('Data encryption key loaded successfully');

export const cryptoConfig = {
  ALGO: 'aes-256-gcm' as const,
  IV_LENGTH: 12,
  KEY_BUFFER: encryptionKeyBuffer,
};
