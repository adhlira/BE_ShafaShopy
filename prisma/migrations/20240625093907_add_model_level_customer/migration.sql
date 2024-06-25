/*
  Warnings:

  - You are about to drop the column `level` on the `customers` table. All the data in the column will be lost.
  - Added the required column `level_id` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `customers` DROP COLUMN `level`,
    ADD COLUMN `level_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `level_customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `level` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_level_id_fkey` FOREIGN KEY (`level_id`) REFERENCES `level_customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
