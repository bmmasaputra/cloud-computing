/*
  Warnings:

  - You are about to drop the column `crated_at` on the `history_product` table. All the data in the column will be lost.
  - You are about to drop the column `history_id` on the `history_product` table. All the data in the column will be lost.
  - Made the column `createdAt` on table `article` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `users` required. This step will fail if there are existing NULL values in that column.

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
ALTER TABLE `article` MODIFY `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `grade` MODIFY `grade_desc` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `history_product` DROP COLUMN `crated_at`,
    DROP COLUMN `history_id`,
    ADD COLUMN `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `users_id` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `refresh_token` VARCHAR(255) NULL,
    MODIFY `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- CreateIndex
CREATE INDEX `history_id` ON `history_product`(`users_id`);

-- AddForeignKey
ALTER TABLE `history_product` ADD CONSTRAINT `history_product_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `history_product` ADD CONSTRAINT `history_product_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`grades_id`) REFERENCES `grade`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `product_allergen` ADD CONSTRAINT `product_allergen_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `product_allergen` ADD CONSTRAINT `product_allergen_ibfk_2` FOREIGN KEY (`allergy_id`) REFERENCES `allergy`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `product_label` ADD CONSTRAINT `product_label_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `product_label` ADD CONSTRAINT `product_label_ibfk_2` FOREIGN KEY (`label_id`) REFERENCES `label`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `users_allergy` ADD CONSTRAINT `users_allergy_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `users_allergy` ADD CONSTRAINT `users_allergy_ibfk_2` FOREIGN KEY (`allergy_id`) REFERENCES `allergy`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
