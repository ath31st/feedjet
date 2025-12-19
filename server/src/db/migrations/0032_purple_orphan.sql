PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_kiosk_integrations` (
	`kiosk_id` integer NOT NULL,
	`type` text NOT NULL,
	`description` text,
	`login` text,
	`password` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`kiosk_id`) REFERENCES `kiosks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_kiosk_integrations`("kiosk_id", "type", "description", "login", "password", "created_at", "updated_at") SELECT "kiosk_id", "type", "description", "login", "password", "created_at", "updated_at" FROM `kiosk_integrations`;--> statement-breakpoint
DROP TABLE `kiosk_integrations`;--> statement-breakpoint
ALTER TABLE `__new_kiosk_integrations` RENAME TO `kiosk_integrations`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `kiosk_integrations_kiosk_id_unique` ON `kiosk_integrations` (`kiosk_id`);