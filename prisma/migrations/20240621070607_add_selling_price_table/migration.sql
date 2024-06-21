/*
  Warnings:

  - You are about to drop the column `sellingprice0` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sellingprice1` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sellingprice2` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sellingprice3` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sellingprice4` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sellingprice5` on the `products` table. All the data in the column will be lost.
  - Added the required column `color_id` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` DROP COLUMN `sellingprice0`,
    DROP COLUMN `sellingprice1`,
    DROP COLUMN `sellingprice2`,
    DROP COLUMN `sellingprice3`,
    DROP COLUMN `sellingprice4`,
    DROP COLUMN `sellingprice5`,
    ADD COLUMN `color_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `sellingPrice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `price0` DOUBLE NOT NULL,
    `price1` DOUBLE NOT NULL,
    `price2` DOUBLE NOT NULL,
    `price3` DOUBLE NOT NULL,
    `price4` DOUBLE NOT NULL,
    `price5` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `colors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sellingPrice` ADD CONSTRAINT `sellingPrice_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
