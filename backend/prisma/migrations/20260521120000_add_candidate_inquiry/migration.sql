-- AlterTable
ALTER TABLE `ContactRequest` MODIFY `message` TEXT NOT NULL;

-- CreateTable
CREATE TABLE `candidate_inquiry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `date_of_birth` DATE NOT NULL,
    `gender` ENUM('Male', 'Female', 'Other') NULL,
    `current_address` VARCHAR(191) NOT NULL,
    `preferred_location` VARCHAR(191) NOT NULL,
    `residence_status` ENUM('Permanent_Resident', 'Work_Visa', 'Student_Visa', 'Spouse_Visa', 'Other') NULL,
    `japanese_ability` ENUM('N1', 'N2', 'N3', 'N4', 'N5', 'None') NULL,
    `cover_letter` TEXT NULL,
    `resume_key` VARCHAR(191) NOT NULL,
    `resume_type` VARCHAR(191) NULL,
    `state` ENUM('New', 'Reviewing', 'MovedToTalentPool', 'Rejected') NOT NULL DEFAULT 'New',
    `moved_to_pool_at` DATETIME(3) NULL,
    `rejected_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `candidate_inquiry_resume_key_key`(`resume_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
