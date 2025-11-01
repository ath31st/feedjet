import path from 'node:path';
import fs from 'node:fs';
import Logger from '../utils/logger.js';

export const dbPath = process.env.DB_FILE_NAME ?? '';
Logger.info(`Database file: ${dbPath}`);

if (!dbPath || dbPath === '') {
  Logger.error('Error: DB_FILE_NAME environment variable is not set');
  process.exit(1);
}

const resolvedPath = path.resolve(dbPath);
if (!fs.existsSync(resolvedPath)) {
  Logger.error(`Error: Database file ${dbPath} does not exist`);
  process.exit(1);
}

export const cacheDir = process.env.CACHE_DIR ?? './.image-cache';
if (cacheDir) {
  fs.mkdirSync(cacheDir, { recursive: true });
  Logger.info(`Image cache directory: ${cacheDir}`);
}

export const fileStorageDir = process.env.FILE_STORAGE_DIR ?? './file-storage';
if (fileStorageDir) {
  fs.mkdirSync(fileStorageDir, { recursive: true });
  Logger.info(`File storage directory: ${fileStorageDir}`);
}

export const openWeatherApiKey = process.env.OPEN_WEATHER_API_KEY;
if (!openWeatherApiKey) {
  Logger.error('Error: OPEN_WEATHER_API_KEY environment variable is not set');
  process.exit(1);
}

const dataEncryptionKey = process.env.DATA_ENCRYPTION_KEY ?? '';
if (!dataEncryptionKey) {
  Logger.error('Error: DATA_ENCRYPTION_KEY environment variable is not set');
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
  Logger.error(`Error parsing DATA_ENCRYPTION_KEY: ${(err as Error).message}`);
  process.exit(1);
}

Logger.info('Data encryption key loaded successfully');

export const cryptoConfig = {
  ALGO: 'aes-256-gcm' as const,
  IV_LENGTH: 12,
  KEY_BUFFER: encryptionKeyBuffer,
};
