/*
  Warnings:

  - You are about to drop the column `password` on the `admin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `admin` DROP COLUMN `password`,
    MODIFY `role` ENUM('Admin', 'Editor', 'User') NOT NULL DEFAULT 'Admin';


