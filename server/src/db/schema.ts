import type { themes, widgetTypes } from '@shared/types/ui.config.js';
import { sql } from 'drizzle-orm';
import { int, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

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
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(false),
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
