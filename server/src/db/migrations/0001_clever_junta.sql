PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_scenario_items` (
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
	FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "scenario_items_type_check" CHECK(
        (
          "__new_scenario_items"."type" = 'widget'
          AND "__new_scenario_items"."widget_type" IS NOT NULL
          AND "__new_scenario_items"."image_id" IS NULL
          AND "__new_scenario_items"."video_id" IS NULL
        )

        OR

        (
          "__new_scenario_items"."type" = 'image'
          AND "__new_scenario_items"."image_id" IS NOT NULL
          AND "__new_scenario_items"."widget_type" IS NULL
          AND "__new_scenario_items"."video_id" IS NULL
        )

        OR

        (
          "__new_scenario_items"."type" = 'video'
          AND "__new_scenario_items"."video_id" IS NOT NULL
          AND "__new_scenario_items"."widget_type" IS NULL
          AND "__new_scenario_items"."image_id" IS NULL
        )
      )
);
--> statement-breakpoint
INSERT INTO `__new_scenario_items`("id", "scenario_id", "type", "widget_type", "image_id", "video_id", "order", "is_active", "duration_seconds") SELECT "id", "scenario_id", "type", "widget_type", "image_id", "video_id", "order", "is_active", "duration_seconds" FROM `scenario_items`;--> statement-breakpoint
DROP TABLE `scenario_items`;--> statement-breakpoint
ALTER TABLE `__new_scenario_items` RENAME TO `scenario_items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;