CREATE TABLE `scenario_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`scenario_id` integer NOT NULL,
	`type` text NOT NULL,
	`widget_type` text,
	`image_id` integer,
	`video_id` integer,
	`order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`duration_seconds` integer DEFAULT 10,
	FOREIGN KEY (`scenario_id`) REFERENCES `scenarios`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "scenario_items_type_check" CHECK(
        (
          "scenario_items"."type" = 'widget'
          AND "scenario_items"."widget_type" IS NOT NULL
          AND "scenario_items"."image_id" IS NULL
          AND "scenario_items"."video_id" IS NULL
        )

        OR

        (
          "scenario_items"."type" = 'image'
          AND "scenario_items"."image_id" IS NOT NULL
          AND "scenario_items"."widget_type" IS NULL
          AND "scenario_items"."video_id" IS NULL
        )

        OR

        (
          "scenario_items"."type" = 'video'
          AND "scenario_items"."video_id" IS NOT NULL
          AND "scenario_items"."widget_type" IS NULL
          AND "scenario_items"."image_id" IS NULL
        )
      )
);
--> statement-breakpoint
CREATE UNIQUE INDEX `scenario_items_scenario_sequence_unique` ON `scenario_items` (`scenario_id`,`order`);--> statement-breakpoint
CREATE TABLE `scenarios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kiosk_id` integer NOT NULL,
	`name` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`kiosk_id`) REFERENCES `kiosks`(`id`) ON UPDATE no action ON DELETE cascade
);
