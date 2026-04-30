/*
  Warnings:

  - A unique constraint covering the columns `[resume_key]` on the table `Application` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[image_key]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `resume_key` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_key` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `application` ADD COLUMN `cover_letter` TEXT NULL,
    ADD COLUMN `resume_key` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `job` ADD COLUMN `image_key` VARCHAR(191) NOT NULL;

-- CreateIndex

-- CreateIndex
CREATE UNIQUE INDEX `Application_resume_key_key` ON `Application`(`resume_key`);

-- CreateIndex
CREATE UNIQUE INDEX `Job_image_key_key` ON `Job`(`image_key`);

