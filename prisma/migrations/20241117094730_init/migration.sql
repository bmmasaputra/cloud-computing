-- CreateTable
CREATE TABLE `allergy` (
    `id` INTEGER NOT NULL,
    `class` VARCHAR(255) NULL,
    `type` VARCHAR(255) NULL,
    `group` VARCHAR(255) NULL,
    `allergy_name` VARCHAR(255) NULL,
    `allergen` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `article` (
    `id` INTEGER NOT NULL,
    `title` VARCHAR(255) NULL,
    `author` VARCHAR(255) NULL,
    `content` TEXT NULL,
    `img_url` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grade` (
    `id` INTEGER NOT NULL,
    `grade_name` CHAR(1) NULL,
    `grade_desc` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `history_product` (
    `id` VARCHAR(255) NOT NULL,
    `history_id` VARCHAR(255) NULL,
    `product_id` VARCHAR(255) NULL,
    `crated_at` TIMESTAMP(0) NULL,

    INDEX `history_id`(`history_id`),
    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `label` (
    `id` INTEGER NOT NULL,
    `label_name` VARCHAR(255) NULL,
    `label_desc` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `id` VARCHAR(255) NOT NULL,
    `grades_id` INTEGER NULL,
    `calories` VARCHAR(255) NULL,
    `calories_ing` VARCHAR(255) NULL,
    `protein` VARCHAR(255) NULL,
    `protein_ing` VARCHAR(255) NULL,
    `fat` VARCHAR(255) NULL,
    `fat_ing` VARCHAR(255) NULL,
    `fiber` VARCHAR(255) NULL,
    `fiber_ing` VARCHAR(255) NULL,
    `carbo` VARCHAR(255) NULL,
    `carbo_ing` VARCHAR(255) NULL,
    `sugar` VARCHAR(255) NULL,
    `sugar_ing` VARCHAR(255) NULL,

    INDEX `grades_id`(`grades_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_allergen` (
    `id` VARCHAR(255) NOT NULL,
    `product_id` VARCHAR(255) NULL,
    `allergy_id` INTEGER NULL,
    `allergen` VARCHAR(255) NULL,

    INDEX `allergy_id`(`allergy_id`),
    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_label` (
    `id` VARCHAR(255) NOT NULL,
    `product_id` VARCHAR(255) NULL,
    `label_id` INTEGER NULL,

    INDEX `label_id`(`label_id`),
    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,
    `token` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_allergy` (
    `id` VARCHAR(255) NOT NULL,
    `users_id` VARCHAR(255) NULL,
    `allergy_id` INTEGER NULL,

    INDEX `allergy_id`(`allergy_id`),
    INDEX `users_id`(`users_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `history_product` ADD CONSTRAINT `history_product_ibfk_1` FOREIGN KEY (`history_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `history_product` ADD CONSTRAINT `history_product_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`grades_id`) REFERENCES `grade`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product_allergen` ADD CONSTRAINT `product_allergen_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product_allergen` ADD CONSTRAINT `product_allergen_ibfk_2` FOREIGN KEY (`allergy_id`) REFERENCES `allergy`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product_label` ADD CONSTRAINT `product_label_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product_label` ADD CONSTRAINT `product_label_ibfk_2` FOREIGN KEY (`label_id`) REFERENCES `label`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users_allergy` ADD CONSTRAINT `users_allergy_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users_allergy` ADD CONSTRAINT `users_allergy_ibfk_2` FOREIGN KEY (`allergy_id`) REFERENCES `allergy`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
