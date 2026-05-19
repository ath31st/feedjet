ALTER TABLE `ui_config` ADD `screen_rotation` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `ui_config` ADD `animation_mode` text DEFAULT 'full' NOT NULL;--> statement-breakpoint
ALTER TABLE `ui_config` ADD `season_overlay` text DEFAULT 'auto' NOT NULL;