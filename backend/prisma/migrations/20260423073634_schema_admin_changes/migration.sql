/*
  Warnings:

  - You are about to drop the column `password` on the `Admin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Admin` DROP COLUMN `password`,
    MODIFY `role` ENUM('Admin', 'Editor', 'User') NOT NULL DEFAULT 'Admin';


