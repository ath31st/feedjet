PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_branding_config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`organization_name` text DEFAULT 'Организация' NOT NULL,
	`schedule_header_title` text DEFAULT 'Расписание организации' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_branding_config`("id", "organization_name", "schedule_header_title", "created_at", "updated_at") SELECT "id", "organization_name", "schedule_header_title", "created_at", "updated_at" FROM `branding_config`;--> statement-breakpoint
DROP TABLE `branding_config`;--> statement-breakpoint
ALTER TABLE `__new_branding_config` RENAME TO `branding_config`;--> statement-breakpoint
PRAGMA foreign_keys=ON;