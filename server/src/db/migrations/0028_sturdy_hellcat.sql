CREATE TABLE `kiosk_work_schedule` (
	`kiosk_id` integer NOT NULL,
	`day_of_week` integer NOT NULL,
	`is_enabled` integer DEFAULT true NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`kiosk_id`, `day_of_week`),
	FOREIGN KEY (`kiosk_id`) REFERENCES `kiosks`(`id`) ON UPDATE no action ON DELETE cascade
);
