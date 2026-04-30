/*
  Warnings:

  - You are about to drop the column `created_at` on the `admin` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Language` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Made the column `salary_min` on table `job` required. This step will fail if there are existing NULL values in that column.
  - Made the column `salary_max` on table `job` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `admin` DROP COLUMN `created_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `job` MODIFY `salary_min` INTEGER NOT NULL,
    MODIFY `salary_max` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Language_name_key` ON `Language`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Skill_name_key` ON `Skill`(`name`);
