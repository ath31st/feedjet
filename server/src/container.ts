import Parser from 'rss-parser';
import axios from 'axios';
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
import { WeatherForecastClient } from './integration/weather.forecast.client.js';
import { RssFeedCacheService } from './services/rss.feed.cache.service.js';
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
import { ImageStorageService } from './services/image.storage.service.js';
import { LogoStorageService } from './services/logo.storage.service.js';
import { KioskWorkScheduleService } from './services/kiosk.work.schedule.service.js';
import { FullyKioskClient } from './integration/fully.kiosk.client.js';
import { IntegrationService } from './services/integration.service.js';
import { DeviceControlService } from './services/device.control.service.js';
import { BirthdayWidgetTransformService } from './services/birthday.widget.transform.service.js';
import { LogService } from './services/log.service.js';
import { AdbClient } from './integration/adb.client.js';
import { PhilipsJointSpaceClient } from './integration/philips.jointspace.client.js';
import { TickerConfigService } from './services/ticker.config.service.js';
import { ScenarioService } from './services/scenario.service.js';
import { MediaFolderService } from './services/media.folder.service.js';
import { DeviceService } from './services/device.service.js';
import { BrandingConfigService } from './services/branding.config.service.js';

const sqlite = new Database(dbPath);
sqlite.pragma('foreign_keys = ON');
export const db = drizzle(sqlite, { schema });
export type DbType = typeof db;

export const http = axios.create({
  timeout: 2000,
  timeoutErrorMessage: 'Request timeout',
});

export const fullyKioskClient = new FullyKioskClient(http);
export const adbClient = new AdbClient();
export const philipsJointSpaceClient = new PhilipsJointSpaceClient();

export const imageCacheService = new ImageCacheService(cacheDir);
export const videoStorageService = new VideoStorageService(db, fileStorageDir);
export const imageStorageService = new ImageStorageService(db, fileStorageDir);
export const logoStorageService = new LogoStorageService(db, fileStorageDir);

const openWeatherClient = new OpenWeatherAPI({ key: openWeatherApiKey });
export const weatherForecastClient = new WeatherForecastClient(
  openWeatherClient,
);

export const rssParser = new RssParser(new Parser());
export const userService = new UserService(db);
export const authService = new AuthService(userService);
export const rssService = new RssService(db);
export const feedConfigService = new FeedConfigService(db);
export const rssFeedCacheService = new RssFeedCacheService(
  rssParser,
  rssService,
  feedConfigService,
);
export const uiConfigService = new UiConfigService(db);
export const brandingConfigService = new BrandingConfigService(db);
export const tickerConfigService = new TickerConfigService(db);
export const scheduleEventService = new ScheduleEventService(db);
export const birthdayService = new BirthdayService(db);
export const birthdayFileService = new BirthdayFileService(
  birthdayService,
  fileStorageDir,
);
export const birthdayWidgetTransformService =
  new BirthdayWidgetTransformService(db);
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
export const kioskWorkScheduleService = new KioskWorkScheduleService(db);
export const integrationService = new IntegrationService(
  db,
  philipsJointSpaceClient,
);
export const deviceService = new DeviceService(db);
export const deviceControlService = new DeviceControlService(
  integrationService,
  fullyKioskClient,
  adbClient,
  philipsJointSpaceClient,
);
export const scenarioService = new ScenarioService(db);
export const mediaFolderService = new MediaFolderService(db);
export const logService = new LogService();

export const t = initTRPC.context<Context>().create();
export const eventBus = new EventEmitter();
