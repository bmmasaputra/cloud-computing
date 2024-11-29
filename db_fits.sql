CREATE TABLE `users` (
  `id` varchar(255) PRIMARY KEY,
  `name` varchar(255),
  `email` varchar(255),
  `password` varchar(255),
  `token` varchar(255),
  `created_at` timestamp
);

CREATE TABLE `users_allergy` (
  `id` varchar(255) PRIMARY KEY,
  `users_id` varchar(255),
  `allergy_id` int
);

CREATE TABLE `allergy` (
  `id` int PRIMARY KEY,
  `class` varchar(255),
  `type` varchar(255),
  `group` varchar(255),
  `allergy_name` varchar(255),
  `allergen` varchar(255)
);

CREATE TABLE `history_product` (
  `id` varchar(255) PRIMARY KEY,
  `history_id` varchar(255),
  `product_id` varchar(255),
  `crated_at` timestamp
);

CREATE TABLE `product` (
  `id` varchar(255) PRIMARY KEY,
  `grades_id` int,
  `calories` varchar(255),
  `calories_ing` varchar(255),
  `protein` varchar(255),
  `protein_ing` varchar(255),
  `fat` varchar(255),
  `fat_ing` varchar(255),
  `fiber` varchar(255),
  `fiber_ing` varchar(255),
  `carbo` varchar(255),
  `carbo_ing` varchar(255),
  `sugar` varchar(255),
  `sugar_ing` varchar(255)
);

CREATE TABLE `product_label` (
  `id` varchar(255) PRIMARY KEY,
  `product_id` varchar(255),
  `label_id` int
);

CREATE TABLE `label` (
  `id` int PRIMARY KEY,
  `label_name` varchar(255),
  `label_desc` varchar(255)
);

CREATE TABLE `grade` (
  `id` int PRIMARY KEY,
  `grade_name` char,
  `grade_desc` varchar(255)
);

CREATE TABLE `product_allergen` (
  `id` varchar(255) PRIMARY KEY,
  `product_id` varchar(255),
  `allergy_id` int,
  `allergen` varchar(255)
);

CREATE TABLE `article` (
  `id` int PRIMARY KEY,
  `title` varchar(255),
  `author` varchar(255),
  `content` text,
  `img_url` varchar(255),
  `createdAt` timestamp
);

ALTER TABLE `users_allergy` ADD FOREIGN KEY (`users_id`) REFERENCES `users` (`id`);

ALTER TABLE `users_allergy` ADD FOREIGN KEY (`allergy_id`) REFERENCES `allergy` (`id`);

ALTER TABLE `history_product` ADD FOREIGN KEY (`history_id`) REFERENCES `users` (`id`);

ALTER TABLE `history_product` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `product` ADD FOREIGN KEY (`grades_id`) REFERENCES `grade` (`id`);

ALTER TABLE `product_label` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `product_label` ADD FOREIGN KEY (`label_id`) REFERENCES `label` (`id`);

ALTER TABLE `product_allergen` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `product_allergen` ADD FOREIGN KEY (`allergy_id`) REFERENCES `allergy` (`id`);
