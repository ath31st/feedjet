CREATE TABLE `feed_config` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`cells_per_page` integer DEFAULT 6 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
DROP TABLE `kiosk_config`;