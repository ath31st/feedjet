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
import { KioskConfigService } from './services/kiosk.config.service.js';
import { ensureKioskConfig } from './db/initialize.kiosk.config.js';
import Logger from './utils/logger.js';
import { AuthService } from './services/auth.service.js';
import type { Context } from './trpc/context.js';
import { EventEmitter } from 'events';

const dbPath = process.env.DB_FILE_NAME ?? '';

Logger.log(`Database file: ${dbPath}`);

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

ensureKioskConfig(db);

export type DbType = typeof db;

export const rssParser = new RssParser(new Parser());
export const userService = new UserService(db);
export const authService = new AuthService(userService);
export const rssService = new RssService(db);
export const kioskConfigService = new KioskConfigService(db);

export const t = initTRPC.context<Context>().create();
export const publicProcedure = t.procedure;

export const eventBus = new EventEmitter();
