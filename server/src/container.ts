import Parser from 'rss-parser';
import { RssParser } from './services/rss.parser.service.js';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import * as schema from './db/schema.js';
import { UserService } from './services/user.service.js';
import { initTRPC } from '@trpc/server';
import { RssService } from './services/rss.service.js';
import { FeedConfigService } from './services/feed.config.service.js';
import Logger from './utils/logger.js';
import { AuthService } from './services/auth.service.js';
import type { Context } from './trpc/context.js';
import { EventEmitter } from 'node:events';
import { UiConfigService } from './services/ui.config.service.js';
import { ensureUiConfig } from './db/initialize.ui.config.js';
import { ensureFeedConfig } from './db/initialize.feed.config.js';
import { ScheduleEventService } from './services/schedule.event.service.js';
import { ImageCacheService } from './services/image.cache.service.js';

const dbPath = process.env.DB_FILE_NAME ?? '';

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
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
ensureFeedConfig(db);
ensureUiConfig(db);
export type DbType = typeof db;

export const cacheDir = process.env.CACHE_DIR ?? './.image-cache';
if (cacheDir) {
  fs.mkdirSync(cacheDir, { recursive: true });
  Logger.info(`Image cache directory: ${cacheDir}`);
}

export const imageCacheService = new ImageCacheService(cacheDir);

export const rssParser = new RssParser(new Parser());
export const userService = new UserService(db);
export const authService = new AuthService(userService);
export const rssService = new RssService(db);
export const feedConfigService = new FeedConfigService(db);
export const uiConfigService = new UiConfigService(db);
export const scheduleEventService = new ScheduleEventService(db);

export const t = initTRPC.context<Context>().create();
export const publicProcedure = t.procedure;

export const eventBus = new EventEmitter();
