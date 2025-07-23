ALTER TABLE `rss_feeds` ADD `updated_at` integer DEFAULT (current_timestamp) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `created_at` integer DEFAULT (current_timestamp) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `updated_at` integer DEFAULT (current_timestamp) NOT NULL;