-- AlterTable
ALTER TABLE `application` ADD COLUMN `starred` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `candidate_inquiry` ADD COLUMN `starred` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `Application_starred_idx` ON `Application`(`starred`);

-- CreateIndex
CREATE INDEX `candidate_inquiry_starred_idx` ON `candidate_inquiry`(`starred`);
