ALTER TABLE `pamphlet_contacts` MODIFY COLUMN `pamphlet_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `pamphlet_images` MODIFY COLUMN `pamphlet_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `pamphlets` MODIFY COLUMN `title` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `pamphlets` MODIFY COLUMN `category` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `pamphlets` MODIFY COLUMN `location_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `pamphlets` MODIFY COLUMN `user_id` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `pamphlets` MODIFY COLUMN `url_key` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `name` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `password` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `pamphlets` ADD CONSTRAINT `pamphlets_url_key_idx` UNIQUE(`url_key`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_idx` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `pamphlet_contacts` ADD CONSTRAINT `pamphlet_contacts_pamphlet_id_pamphlets_id_fk` FOREIGN KEY (`pamphlet_id`) REFERENCES `pamphlets`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pamphlet_images` ADD CONSTRAINT `pamphlet_images_pamphlet_id_pamphlets_id_fk` FOREIGN KEY (`pamphlet_id`) REFERENCES `pamphlets`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pamphlets` ADD CONSTRAINT `pamphlets_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;