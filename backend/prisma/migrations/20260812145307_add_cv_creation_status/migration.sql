-- AlterTable
ALTER TABLE `application` ADD COLUMN `cv_creation_status` ENUM('Pending', 'OnProgress', 'Completed', 'OnHold') NOT NULL DEFAULT 'Pending';

-- CreateIndex
CREATE INDEX `Application_cv_creation_status_idx` ON `Application`(`cv_creation_status`);
