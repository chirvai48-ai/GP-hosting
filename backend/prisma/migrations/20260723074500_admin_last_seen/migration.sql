-- AlterTable
ALTER TABLE `admin` ADD COLUMN `lastSeenApplicationsAt` DATETIME(3) NULL,
    ADD COLUMN `lastSeenMessagesAt` DATETIME(3) NULL;
