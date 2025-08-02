import type { themes, widgetTypes } from '@shared/types/ui.config.js';
import { sql } from 'drizzle-orm';
import { int, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

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
  id: integer('id').primaryKey().default(1),
  cellsPerPage: integer('cells_per_page').notNull().default(6),
  pagesCount: integer('pages_count').notNull().default(1),
  carouselIntervalMs: integer('carousel_interval_ms').notNull().default(30000),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const uiConfigTable = sqliteTable('ui_config', {
  id: integer('id').primaryKey().default(1),
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
  start_time: text('start_time').notNull(),
  end_time: text('end_time'),
  title: text('title').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});
