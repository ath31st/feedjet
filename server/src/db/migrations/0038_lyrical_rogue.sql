ALTER TABLE `birthdays` ADD `dedup_key` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `birthdays_dedup_key_unique` ON `birthdays` (`dedup_key`);