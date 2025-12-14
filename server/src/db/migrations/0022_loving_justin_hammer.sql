CREATE TABLE `kiosk_videos` (
	`kiosk_id` integer NOT NULL,
	`video_id` integer NOT NULL,
	`is_active` integer DEFAULT false NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`kiosk_id`, `video_id`),
	FOREIGN KEY (`kiosk_id`) REFERENCES `kiosks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON UPDATE no action ON DELETE cascade
);
