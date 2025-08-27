DROP INDEX `videos_name_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `videos_file_name_unique` ON `videos` (`file_name`);