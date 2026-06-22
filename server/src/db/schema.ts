import type {
  IntegrationConfig,
  IntegrationType,
} from '@shared/types/integration.js';
import type { DayOfWeek } from '@shared/types/kiosk.work.schedule.js';
import type {
  animationTypes,
  screenRotations,
  seasonOverlayModes,
  themes,
  widgetTypes,
} from '@shared/types/ui.config.js';
import { sql } from 'drizzle-orm';
import {
  check,
  int,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

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
  screenRotation: integer('screen_rotation')
    .notNull()
    .default(0)
    .$type<(typeof screenRotations)[number]>(),
  animationMode: text('animation_mode')
    .notNull()
    .default('full')
    .$type<(typeof animationTypes)[number]>(),
  seasonOverlay: text('season_overlay')
    .notNull()
    .default('auto')
    .$type<(typeof seasonOverlayModes)[number]>(),
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

export const mediaFoldersTable = sqliteTable(
  'media_folders',
  {
    id: integer('id').primaryKey({
      autoIncrement: true,
    }),
    name: text('name').notNull(),
    parentId: integer('parent_id').references(
      (): AnySQLiteColumn => mediaFoldersTable.id,
      {
        onDelete: 'cascade',
      },
    ),
    createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at').notNull().default(sql`(unixepoch())`),
  },

  (table) => [
    uniqueIndex('media_folder_parent_name_unique').on(
      table.parentId,
      table.name,
    ),

    check(
      'media_folder_not_self_parent',
      sql`${table.id} != ${table.parentId}`,
    ),
  ],
);

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
  folderId: integer('folder_id').references(() => mediaFoldersTable.id, {
    onDelete: 'set null',
  }),
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
});

export const birthdaysTable = sqliteTable('birthdays', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  fullNameEnc: text('full_name').notNull(),
  departmentEnc: text('department'),
  birthDate: integer('birth_date', { mode: 'timestamp' }).notNull(),
  dedupKey: text('dedup_key').unique().notNull(),
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
  folderId: integer('folder_id').references(() => mediaFoldersTable.id, {
    onDelete: 'set null',
  }),
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
    durationSeconds: integer('duration_seconds').notNull().default(0),
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

export const kioskIntegrationsTable = sqliteTable('kiosk_integrations', {
  kioskId: integer('kiosk_id')
    .primaryKey()
    .references(() => kiosksTable.id, { onDelete: 'cascade' }),
  type: text('type').notNull().$type<IntegrationType>(),
  description: text('description'),
  login: text('login'),
  passwordEnc: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const birthdayWidgetTransformTable = sqliteTable(
  'birthday_widget_transform',
  {
    month: integer('month').primaryKey(),
    width: integer('width').notNull().default(50),
    height: integer('height').notNull().default(50),
    posX: integer('pos_x').notNull().default(50),
    posY: integer('pos_y').notNull().default(50),
    fontScale: integer('font_scale').notNull().default(100),
    rotateZ: integer('rotate_z').notNull().default(0),
    rotateX: integer('rotate_x').notNull().default(0),
    rotateY: integer('rotate_y').notNull().default(0),
    lineGap: integer('line_gap').notNull().default(100),
    textColor: text('text_color').notNull().default('#ffffff'),
    shadowBlur: integer('shadow_blur').notNull().default(0),
    lineOffsetX: integer('line_offset_x').notNull().default(0),
    lineOffsetY: integer('line_offset_y').notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
);

export const tickerConfigTable = sqliteTable('ticker_config', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  kioskId: integer('kiosk_id')
    .notNull()
    .references(() => kiosksTable.id, { onDelete: 'cascade' })
    .unique(),
  text: text('text').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(false),
  speedPxPerSec: integer('speed_px_per_sec').notNull().default(60),
  direction: text('direction').notNull().$type<'left' | 'right'>(),
  fontScale: integer('font_scale').notNull().default(100),
  textColor: text('text_color').notNull().default('#ffffff'),
  backgroundColor: text('background_color').notNull().default('#000000'),
  backgroundOpacity: integer('background_opacity').notNull().default(100),
  height: integer('height').notNull().default(50),
  positionY: integer('position_y').notNull().default(0),
  paddingX: integer('padding_x').notNull().default(0),
  isLooped: integer('is_looped', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const scenariosTable = sqliteTable('scenarios', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  kioskId: integer('kiosk_id')
    .notNull()
    .references(() => kiosksTable.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at').notNull().default(sql`(unixepoch())`),
});

export const scenarioItemsTable = sqliteTable(
  'scenario_items',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    scenarioId: integer('scenario_id')
      .notNull()
      .references(() => scenariosTable.id, { onDelete: 'cascade' }),
    type: text('type', { enum: ['widget', 'image', 'video'] }).notNull(),
    widgetType: text('widget_type').$type<(typeof widgetTypes)[number]>(),
    imageId: integer('image_id').references(() => imagesTable.id, {
      onDelete: 'cascade',
    }),
    videoId: integer('video_id').references(() => videosTable.id, {
      onDelete: 'cascade',
    }),
    order: integer('order').notNull().default(0),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    durationSeconds: integer('duration_seconds').default(10),
  },
  (table) => [
    check(
      'scenario_items_type_check',

      sql`
        (
          ${table.type} = 'widget'
          AND ${table.widgetType} IS NOT NULL
          AND ${table.imageId} IS NULL
          AND ${table.videoId} IS NULL
        )

        OR

        (
          ${table.type} = 'image'
          AND ${table.imageId} IS NOT NULL
          AND ${table.widgetType} IS NULL
          AND ${table.videoId} IS NULL
        )

        OR

        (
          ${table.type} = 'video'
          AND ${table.videoId} IS NOT NULL
          AND ${table.widgetType} IS NULL
          AND ${table.imageId} IS NULL
        )
      `,
    ),
  ],
);

export const integrationsTable = sqliteTable(
  'integrations',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    type: text('type').notNull().$type<IntegrationType>(),
    ip: text('ip').notNull(),
    port: integer('port').notNull(),
    description: text('description'),
    config: text('config', { mode: 'json' })
      .notNull()
      .$type<IntegrationConfig>(),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    uniqueIndex('integration_host_port_unique').on(table.ip, table.port),
  ],
);

export const devicesTable = sqliteTable(
  'devices',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    deviceId: text('device_id').notNull().unique(),
    ip: text('ip').notNull(),
    userAgent: text('user_agent').notNull(),
    platform: text('platform'),
    firstSeenAt: integer('first_seen_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    lastSeenAt: integer('last_seen_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [uniqueIndex('devices_device_id_unique').on(table.deviceId)],
);
