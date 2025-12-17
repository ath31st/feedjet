CREATE TABLE `kiosk_integrations` (
	`kiosk_id` integer NOT NULL,
	`type` text NOT NULL,
	`url` text,
	`login` text,
	`password` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`kiosk_id`, `type`),
	FOREIGN KEY (`kiosk_id`) REFERENCES `kiosks`(`id`) ON UPDATE no action ON DELETE cascade
);
