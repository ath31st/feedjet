CREATE TABLE `birthday_widget_transform` (
	`month` integer PRIMARY KEY NOT NULL,
	`width` integer DEFAULT 50 NOT NULL,
	`height` integer DEFAULT 50 NOT NULL,
	`pos_x` integer DEFAULT 50 NOT NULL,
	`pos_y` integer DEFAULT 50 NOT NULL,
	`font_scale` integer DEFAULT 100 NOT NULL,
	`rotate_z` integer DEFAULT 0 NOT NULL,
	`rotate_x` integer DEFAULT 0 NOT NULL,
	`rotate_y` integer DEFAULT 0 NOT NULL,
	`line_gap` integer DEFAULT 100 NOT NULL,
	`text_color` text DEFAULT '#ffffff' NOT NULL,
	`shadow_blur` integer DEFAULT 0 NOT NULL,
	`line_offset_x` integer DEFAULT 0 NOT NULL,
	`line_offset_y` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `birthdays` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`full_name` text NOT NULL,
	`department` text,
	`birth_date` integer NOT NULL,
	`dedup_key` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `birthdays_dedup_key_unique` ON `birthdays` (`dedup_key`);--> statement-breakpoint
CREATE TABLE `feed_config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kiosk_id` integer NOT NULL,
	`visible_cell_count` integer DEFAULT 6 NOT NULL,
	`carousel_size` integer DEFAULT 6 NOT NULL,
	`carousel_interval_ms` integer DEFAULT 30000 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`kiosk_id`) REFERENCES `kiosks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `feed_config_kiosk_id_unique` ON `feed_config` (`kiosk_id`);--> statement-breakpoint
CREATE TABLE `images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`file_name` text NOT NULL,
	`format` text NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`size` integer NOT NULL,
	`thumbnail` text NOT NULL,
	`mtime` integer NOT NULL,
	`folder_id` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`folder_id`) REFERENCES `media_folders`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `images_file_name_unique` ON `images` (`file_name`);--> statement-breakpoint
CREATE TABLE `kiosk_images` (
	`kiosk_id` integer NOT NULL,
	`image_id` integer NOT NULL,
	`is_active` integer DEFAULT false NOT NULL,
	`duration_seconds` integer DEFAULT 0 NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`kiosk_id`, `image_id`),
	FOREIGN KEY (`kiosk_id`) REFERENCES `kiosks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `kiosk_integrations` (
	`kiosk_id` integer PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`description` text,
	`login` text,
	`password` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`kiosk_id`) REFERENCES `kiosks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `kiosk_videos` (
	`kiosk_id` integer NOT NULL,
	`video_id` integer NOT NULL,
	`is_active` integer DEFAULT false NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`kiosk_id`, `video_id`),
	FOREIGN KEY (`kiosk_id`) REFERENCES `kiosks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `kiosk_work_schedule` (
	`kiosk_id` integer NOT NULL,
	`day_of_week` integer NOT NULL,
	`is_enabled` integer DEFAULT true NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`kiosk_id`, `day_of_week`),
	FOREIGN KEY (`kiosk_id`) REFERENCES `kiosks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `kiosks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`location` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `kiosks_name_unique` ON `kiosks` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `kiosks_slug_unique` ON `kiosks` (`slug`);--> statement-breakpoint
CREATE TABLE `media_folders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`parent_id` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `media_folders`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "media_folder_not_self_parent" CHECK("media_folders"."id" != "media_folders"."parent_id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_folder_parent_name_unique` ON `media_folders` (`parent_id`,`name`);--> statement-breakpoint
CREATE TABLE `rss_feeds` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`name` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rss_feeds_url_unique` ON `rss_feeds` (`url`);--> statement-breakpoint
CREATE TABLE `scenario_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`scenario_id` integer NOT NULL,
	`type` text NOT NULL,
	`widget_type` text,
	`image_id` integer,
	`video_id` integer,
	`order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`duration_seconds` integer DEFAULT 10,
	FOREIGN KEY (`scenario_id`) REFERENCES `scenarios`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "scenario_items_type_check" CHECK(
        (
          "scenario_items"."type" = 'widget'
          AND "scenario_items"."widget_type" IS NOT NULL
          AND "scenario_items"."image_id" IS NULL
          AND "scenario_items"."video_id" IS NULL
        )

        OR

        (
          "scenario_items"."type" = 'image'
          AND "scenario_items"."image_id" IS NOT NULL
          AND "scenario_items"."widget_type" IS NULL
          AND "scenario_items"."video_id" IS NULL
        )

        OR

        (
          "scenario_items"."type" = 'video'
          AND "scenario_items"."video_id" IS NOT NULL
          AND "scenario_items"."widget_type" IS NULL
          AND "scenario_items"."image_id" IS NULL
        )
      )
);
--> statement-breakpoint
CREATE UNIQUE INDEX `scenario_items_scenario_sequence_unique` ON `scenario_items` (`scenario_id`,`order`);--> statement-breakpoint
CREATE TABLE `scenarios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kiosk_id` integer NOT NULL,
	`name` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`kiosk_id`) REFERENCES `kiosks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `schedule_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text,
	`title` text NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ticker_config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kiosk_id` integer NOT NULL,
	`text` text NOT NULL,
	`is_active` integer DEFAULT false NOT NULL,
	`speed_px_per_sec` integer DEFAULT 60 NOT NULL,
	`direction` text NOT NULL,
	`font_scale` integer DEFAULT 100 NOT NULL,
	`text_color` text DEFAULT '#ffffff' NOT NULL,
	`background_color` text DEFAULT '#000000' NOT NULL,
	`background_opacity` integer DEFAULT 100 NOT NULL,
	`height` integer DEFAULT 50 NOT NULL,
	`position_y` integer DEFAULT 0 NOT NULL,
	`padding_x` integer DEFAULT 0 NOT NULL,
	`is_looped` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`kiosk_id`) REFERENCES `kiosks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ticker_config_kiosk_id_unique` ON `ticker_config` (`kiosk_id`);--> statement-breakpoint
CREATE TABLE `ui_config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kiosk_id` integer NOT NULL,
	`rotating_widgets` text NOT NULL,
	`auto_switch_interval_ms` integer DEFAULT 30000 NOT NULL,
	`theme` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`kiosk_id`) REFERENCES `kiosks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ui_config_kiosk_id_unique` ON `ui_config` (`kiosk_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`login` text NOT NULL,
	`password` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_login_unique` ON `users` (`login`);--> statement-breakpoint
CREATE TABLE `videos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`file_name` text NOT NULL,
	`format` text NOT NULL,
	`duration` integer NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`size` integer NOT NULL,
	`mtime` integer NOT NULL,
	`folder_id` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`folder_id`) REFERENCES `media_folders`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `videos_file_name_unique` ON `videos` (`file_name`);