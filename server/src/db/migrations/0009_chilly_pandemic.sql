CREATE TABLE `branding_config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_name` text DEFAULT 'Организация' NOT NULL,
	`schedule_header_title` text DEFAULT 'Расписание организации' NOT NULL,
	`logo_image_id` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`logo_image_id`) REFERENCES `logos`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `logos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`file_name` text NOT NULL,
	`original_name` text NOT NULL,
	`size` integer NOT NULL,
	`width` integer,
	`height` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `logos_file_name_unique` ON `logos` (`file_name`);