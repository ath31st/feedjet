CREATE TABLE `ui_config` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`active_widget` text NOT NULL,
	`rotating_widgets` text NOT NULL,
	`auto_switch_interval_ms` integer DEFAULT 30000 NOT NULL,
	`theme` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
