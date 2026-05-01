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
CREATE UNIQUE INDEX `ticker_config_kiosk_id_unique` ON `ticker_config` (`kiosk_id`);