CREATE TABLE `kiosk_images` (
	`kiosk_id` integer NOT NULL,
	`image_id` integer NOT NULL,
	`is_active` integer DEFAULT false NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`kiosk_id`, `image_id`),
	FOREIGN KEY (`kiosk_id`) REFERENCES `kiosks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `images` DROP COLUMN `order`;--> statement-breakpoint
ALTER TABLE `images` DROP COLUMN `is_active`;