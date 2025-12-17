import type { IntegrationType } from '@shared/types/integration.js';
import type { DayOfWeek } from '@shared/types/kiosk.work.schedule.js';
import type { themes, widgetTypes } from '@shared/types/ui.config.js';
import { sql } from 'drizzle-orm';
import {
  int,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const kiosksTable = sqliteTable('kiosks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  location: text('location'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const usersTable = sqliteTable('users', {
  id: int().primaryKey({ autoIncrement: true }),
  login: text().notNull().unique(),
  password: text().notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const rssFeedsTable = sqliteTable('rss_feeds', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  url: text('url').notNull().unique(),
  name: text('name'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const feedConfigTable = sqliteTable('feed_config', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  kioskId: integer('kiosk_id')
    .notNull()
    .references(() => kiosksTable.id, { onDelete: 'cascade' })
    .unique(),
  visibleCellCount: integer('visible_cell_count').notNull().default(6),
  carouselSize: integer('carousel_size').notNull().default(6),
  carouselIntervalMs: integer('carousel_interval_ms').notNull().default(30000),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const uiConfigTable = sqliteTable('ui_config', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  kioskId: integer('kiosk_id')
    .notNull()
    .references(() => kiosksTable.id, { onDelete: 'cascade' })
    .unique(),
  rotatingWidgets: text('rotating_widgets', { mode: 'json' })
    .notNull()
    .$type<Array<(typeof widgetTypes)[number]>>(),
  autoSwitchIntervalMs: integer('auto_switch_interval_ms')
    .notNull()
    .default(30000),
  theme: text('theme').notNull().$type<(typeof themes)[number]>(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const scheduleEventsTable = sqliteTable('schedule_events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time'),
  title: text('title').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const videosTable = sqliteTable('videos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  fileName: text('file_name').unique().notNull(),
  format: text('format').notNull(),
  duration: integer('duration').notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  size: integer('size').notNull(),
  mtime: integer('mtime').notNull(),
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
});

export const birthdaysTable = sqliteTable('birthdays', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  fullNameEnc: text('full_name').notNull(),
  departmentEnc: text('department'),
  birthDate: integer('birth_date', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const imagesTable = sqliteTable('images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  fileName: text('file_name').unique().notNull(),
  format: text('format').notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  size: integer('size').notNull(),
  thumbnail: text('thumbnail').notNull(),
  mtime: integer('mtime').notNull(),
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
});

export const kioskVideosTable = sqliteTable(
  'kiosk_videos',
  {
    kioskId: integer('kiosk_id')
      .notNull()
      .references(() => kiosksTable.id, { onDelete: 'cascade' }),
    videoId: integer('video_id')
      .notNull()
      .references(() => videosTable.id, { onDelete: 'cascade' }),
    isActive: integer('is_active', { mode: 'boolean' })
      .notNull()
      .default(false),
    order: integer('order').notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.kioskId, table.videoId] })],
);

export const kioskImagesTable = sqliteTable(
  'kiosk_images',
  {
    kioskId: integer('kiosk_id')
      .notNull()
      .references(() => kiosksTable.id, { onDelete: 'cascade' }),
    imageId: integer('image_id')
      .notNull()
      .references(() => imagesTable.id, { onDelete: 'cascade' }),
    isActive: integer('is_active', { mode: 'boolean' })
      .notNull()
      .default(false),
    order: integer('order').notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.kioskId, table.imageId] })],
);

export const kioskWorkScheduleTable = sqliteTable(
  'kiosk_work_schedule',
  {
    kioskId: integer('kiosk_id')
      .notNull()
      .references(() => kiosksTable.id, { onDelete: 'cascade' }),
    dayOfWeek: integer('day_of_week').notNull().$type<DayOfWeek>(),
    isEnabled: integer('is_enabled', { mode: 'boolean' })
      .notNull()
      .default(true),
    startTime: text('start_time').notNull(),
    endTime: text('end_time').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    primaryKey({
      columns: [table.kioskId, table.dayOfWeek],
    }),
  ],
);

export const kioskIntegrationsTable = sqliteTable(
  'kiosk_integrations',
  {
    kioskId: integer('kiosk_id')
      .notNull()
      .references(() => kiosksTable.id, { onDelete: 'cascade' }),
    type: text('type').notNull().$type<IntegrationType>(),
    url: text('url'),
    login: text('login'),
    passwordEnc: text('password'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [primaryKey({ columns: [table.kioskId, table.type] })],
);
