-- CreateTable
CREATE TABLE `Job` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `salary_min` INTEGER NULL,
    `salary_max` INTEGER NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'YEN',
    `location` VARCHAR(191) NOT NULL,
    `experience` INTEGER NOT NULL,
    `contract` ENUM('Full_time', 'Part_time', 'Internship', 'Flexible') NOT NULL DEFAULT 'Full_time',
    `shift_start` TIME NOT NULL,
    `shift_end` TIME NOT NULL,
    `workdays` INTEGER NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `benefits` VARCHAR(191) NOT NULL,
    `requirements` VARCHAR(191) NOT NULL,
    `application_method` VARCHAR(191) NOT NULL,
    `job_category_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `soft_skills` VARCHAR(191) NOT NULL,
    `status` ENUM('Draft', 'Published', 'Closed', 'Archived') NOT NULL DEFAULT 'Draft',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Skill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Language` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `JobCategory_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('Admin', 'Editor', 'User') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Application` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(191) NOT NULL,
    `date_of_birth` DATE NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `current_address` VARCHAR(191) NOT NULL,
    `permanent_address` VARCHAR(191) NOT NULL,
    `preferred_location` VARCHAR(191) NOT NULL,
    `availability` ENUM('Full_time', 'Part_time', 'Internship', 'Flexible') NOT NULL,
    `school_college` VARCHAR(191) NOT NULL,
    `degree` VARCHAR(191) NOT NULL,
    `soft_skills` VARCHAR(191) NOT NULL,
    `job_id` INTEGER NOT NULL,
    `status` ENUM('Pending', 'Reviewed', 'Rejected', 'Accepted') NOT NULL DEFAULT 'Pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `News` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,
    `summary` VARCHAR(191) NOT NULL,
    `published_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `admin_id` VARCHAR(191) NULL,
    `status` ENUM('published', 'closed') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `status` ENUM('Open', 'Inprogress', 'Resolved', 'Closed') NOT NULL DEFAULT 'Open',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactReply` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contact_request_id` INTEGER NULL,
    `message` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `adminId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_JobToLanguage` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_JobToLanguage_AB_unique`(`A`, `B`),
    INDEX `_JobToLanguage_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_JobToSkill` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_JobToSkill_AB_unique`(`A`, `B`),
    INDEX `_JobToSkill_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ApplicationToLanguage` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ApplicationToLanguage_AB_unique`(`A`, `B`),
    INDEX `_ApplicationToLanguage_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ApplicationToSkill` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ApplicationToSkill_AB_unique`(`A`, `B`),
    INDEX `_ApplicationToSkill_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Job` ADD CONSTRAINT `Job_job_category_id_fkey` FOREIGN KEY (`job_category_id`) REFERENCES `JobCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `Job`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `News` ADD CONSTRAINT `News_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContactReply` ADD CONSTRAINT `ContactReply_contact_request_id_fkey` FOREIGN KEY (`contact_request_id`) REFERENCES `ContactRequest`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContactReply` ADD CONSTRAINT `ContactReply_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_JobToLanguage` ADD CONSTRAINT `_JobToLanguage_A_fkey` FOREIGN KEY (`A`) REFERENCES `Job`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_JobToLanguage` ADD CONSTRAINT `_JobToLanguage_B_fkey` FOREIGN KEY (`B`) REFERENCES `Language`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_JobToSkill` ADD CONSTRAINT `_JobToSkill_A_fkey` FOREIGN KEY (`A`) REFERENCES `Job`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_JobToSkill` ADD CONSTRAINT `_JobToSkill_B_fkey` FOREIGN KEY (`B`) REFERENCES `Skill`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ApplicationToLanguage` ADD CONSTRAINT `_ApplicationToLanguage_A_fkey` FOREIGN KEY (`A`) REFERENCES `Application`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ApplicationToLanguage` ADD CONSTRAINT `_ApplicationToLanguage_B_fkey` FOREIGN KEY (`B`) REFERENCES `Language`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ApplicationToSkill` ADD CONSTRAINT `_ApplicationToSkill_A_fkey` FOREIGN KEY (`A`) REFERENCES `Application`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ApplicationToSkill` ADD CONSTRAINT `_ApplicationToSkill_B_fkey` FOREIGN KEY (`B`) REFERENCES `Skill`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
