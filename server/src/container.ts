import Parser from 'rss-parser';
import { RssParser } from './services/rss.parser.service.js';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './db/schema.js';
import { UserService } from './services/user.service.js';
import { initTRPC } from '@trpc/server';
import { RssService } from './services/rss.service.js';
import { FeedConfigService } from './services/feed.config.service.js';
import { AuthService } from './services/auth.service.js';
import type { Context } from './trpc/context.js';
import { EventEmitter } from 'node:events';
import { UiConfigService } from './services/ui.config.service.js';
import { ScheduleEventService } from './services/schedule.event.service.js';
import { ImageCacheService } from './services/image.cache.service.js';
import { OpenWeatherAPI } from 'openweather-api-node';
import { WeatherForecastService } from './services/weather.forecast.service.js';
import { VideoStorageService } from './services/video.storage.service.js';
import {
  cacheDir,
  dbPath,
  fileStorageDir,
  openWeatherApiKey,
} from './config/config.js';
import { KioskService } from './services/kiosk.service.js';
import { BirthdayService } from './services/birthday.service.js';
import { BirthdayFileService } from './services/birthday.file.service.js';
import { BirthdayBackgroundService } from './services/birthday.background.service.js';
import { KioskHeartbeatService } from './services/kiosk.heartbeat.service.js';
import { ImageStorageService } from './services/image.storage.service.js';

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
export type DbType = typeof db;

export const imageCacheService = new ImageCacheService(cacheDir);
export const videoStorageService = new VideoStorageService(db, fileStorageDir);
export const imageStorageService = new ImageStorageService(db, fileStorageDir);

const openWeatherClient = new OpenWeatherAPI({ key: openWeatherApiKey });
export const weatherForecastService = new WeatherForecastService(
  openWeatherClient,
);

export const rssParser = new RssParser(new Parser());
export const userService = new UserService(db);
export const authService = new AuthService(userService);
export const rssService = new RssService(db);
export const feedConfigService = new FeedConfigService(db);
export const uiConfigService = new UiConfigService(db);
export const scheduleEventService = new ScheduleEventService(db);
export const birthdayService = new BirthdayService(db);
export const birthdayFileService = new BirthdayFileService(
  birthdayService,
  fileStorageDir,
);
export const birthdayBackgroundService = new BirthdayBackgroundService(
  db,
  fileStorageDir,
);
export const kioskService = new KioskService(
  db,
  uiConfigService,
  feedConfigService,
);
kioskService.ensureDefaultKiosk();
videoStorageService.syncWithDisk();
imageStorageService.syncWithDisk();
export const kioskHeartbeatService = new KioskHeartbeatService();

export const t = initTRPC.context<Context>().create();
export const publicProcedure = t.procedure;

export const eventBus = new EventEmitter();
