PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_rss_feeds` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_rss_feeds`("id", "url", "is_active", "created_at", "updated_at") SELECT "id", "url", "is_active", "created_at", "updated_at" FROM `rss_feeds`;--> statement-breakpoint
DROP TABLE `rss_feeds`;--> statement-breakpoint
ALTER TABLE `__new_rss_feeds` RENAME TO `rss_feeds`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `rss_feeds_url_unique` ON `rss_feeds` (`url`);