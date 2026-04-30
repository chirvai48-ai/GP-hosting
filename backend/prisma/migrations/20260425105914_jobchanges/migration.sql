/*
  Warnings:

  - Added the required column `image_type` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `job` ADD COLUMN `image_type` VARCHAR(191) NOT NULL;




