PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_feed_config` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`visible_cell_count` integer DEFAULT 6 NOT NULL,
	`carousel_size` integer DEFAULT 6 NOT NULL,
	`carousel_interval_ms` integer DEFAULT 30000 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_feed_config`("id", "visible_cell_count", "carousel_size", "carousel_interval_ms", "created_at", "updated_at") SELECT "id", "visible_cell_count", "carousel_size", "carousel_interval_ms", "created_at", "updated_at" FROM `feed_config`;--> statement-breakpoint
DROP TABLE `feed_config`;--> statement-breakpoint
ALTER TABLE `__new_feed_config` RENAME TO `feed_config`;--> statement-breakpoint
PRAGMA foreign_keys=ON;