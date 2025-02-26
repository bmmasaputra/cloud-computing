/*
  Warnings:

  - You are about to drop the column `createdAt` on the `article` table. All the data in the column will be lost.
  - Added the required column `date` to the `article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `health_assessment` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overall` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `history_product` DROP FOREIGN KEY `history_product_ibfk_1`;

-- DropForeignKey
ALTER TABLE `history_product` DROP FOREIGN KEY `history_product_ibfk_2`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `product_ibfk_1`;

-- DropForeignKey
ALTER TABLE `product_allergen` DROP FOREIGN KEY `product_allergen_ibfk_1`;

-- DropForeignKey
ALTER TABLE `product_allergen` DROP FOREIGN KEY `product_allergen_ibfk_2`;

-- DropForeignKey
ALTER TABLE `product_label` DROP FOREIGN KEY `product_label_ibfk_1`;

-- DropForeignKey
ALTER TABLE `product_label` DROP FOREIGN KEY `product_label_ibfk_2`;

-- DropForeignKey
ALTER TABLE `users_allergy` DROP FOREIGN KEY `users_allergy_ibfk_1`;

-- DropForeignKey
ALTER TABLE `users_allergy` DROP FOREIGN KEY `users_allergy_ibfk_2`;

-- AlterTable
ALTER TABLE `article` DROP COLUMN `createdAt`,
    ADD COLUMN `date` DATE NOT NULL,
    ADD COLUMN `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `health_assessment` TEXT NOT NULL,
    ADD COLUMN `name` VARCHAR(255) NULL,
    ADD COLUMN `overall` TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE `history_product` ADD CONSTRAINT `history_product_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

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
