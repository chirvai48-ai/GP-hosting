-- AlterTable
ALTER TABLE `Admin` ADD COLUMN `lastSeenApplicationsAt` DATETIME(3) NULL,
    ADD COLUMN `lastSeenMessagesAt` DATETIME(3) NULL;
