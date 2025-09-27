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
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_feed_config` (
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
INSERT INTO `__new_feed_config`("id", "kiosk_id", "visible_cell_count", "carousel_size", "carousel_interval_ms", "created_at", "updated_at") SELECT "id", "kiosk_id", "visible_cell_count", "carousel_size", "carousel_interval_ms", "created_at", "updated_at" FROM `feed_config`;--> statement-breakpoint
DROP TABLE `feed_config`;--> statement-breakpoint
ALTER TABLE `__new_feed_config` RENAME TO `feed_config`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `feed_config_kiosk_id_unique` ON `feed_config` (`kiosk_id`);--> statement-breakpoint
CREATE TABLE `__new_ui_config` (
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
INSERT INTO `__new_ui_config`("id", "kiosk_id", "rotating_widgets", "auto_switch_interval_ms", "theme", "created_at", "updated_at") SELECT "id", "kiosk_id", "rotating_widgets", "auto_switch_interval_ms", "theme", "created_at", "updated_at" FROM `ui_config`;--> statement-breakpoint
DROP TABLE `ui_config`;--> statement-breakpoint
ALTER TABLE `__new_ui_config` RENAME TO `ui_config`;--> statement-breakpoint
CREATE UNIQUE INDEX `ui_config_kiosk_id_unique` ON `ui_config` (`kiosk_id`);