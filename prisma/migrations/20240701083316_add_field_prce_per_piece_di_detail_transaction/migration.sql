/*
  Warnings:

  - Added the required column `price_per_piece` to the `detail_transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `detail_transaction` ADD COLUMN `price_per_piece` DOUBLE NOT NULL;
