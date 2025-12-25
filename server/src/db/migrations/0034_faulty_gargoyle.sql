CREATE TABLE `birthday_widget_config` (
	`month` integer PRIMARY KEY NOT NULL,
	`pos_x` integer DEFAULT 50 NOT NULL,
	`pos_y` integer DEFAULT 50 NOT NULL,
	`font_scale` integer DEFAULT 100 NOT NULL,
	`rotate_z` integer DEFAULT 0 NOT NULL,
	`rotate_x` integer DEFAULT 0 NOT NULL,
	`rotate_y` integer DEFAULT 0 NOT NULL,
	`line_gap` integer DEFAULT 100 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
