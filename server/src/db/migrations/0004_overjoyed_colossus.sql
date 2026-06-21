ALTER TABLE `integrations` RENAME COLUMN "host" TO "ip";--> statement-breakpoint
DROP INDEX `integration_host_port_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `integration_host_port_unique` ON `integrations` (`ip`,`port`);