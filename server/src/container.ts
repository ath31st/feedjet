import Parser from 'rss-parser';
import { RssParser } from './services/parser.service.js';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import * as schema from './db/schema.js';
import { UserService } from './services/user.service.js';
import { UserController } from './controllers/user.controller.js';
import { initTRPC } from '@trpc/server';

const dbPath = process.env.DB_FILE_NAME ?? '';

console.log(`Database file: ${dbPath}`);

if (!dbPath || dbPath === '') {
  console.error('Error: DB_FILE_NAME environment variable is not set');
  process.exit(1);
}
const resolvedPath = path.resolve(dbPath);
if (!fs.existsSync(resolvedPath)) {
  console.error(`Error: Database file ${dbPath} does not exist`);
  process.exit(1);
}
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
export type DbType = typeof db;

export const rssParser = new RssParser(new Parser());

export const userService = new UserService(db);
export const userController = new UserController(userService);

export const t = initTRPC.create();
