-- AlterTable
ALTER TABLE `Application` ADD COLUMN `country` VARCHAR(191) NULL,
    ADD COLUMN `facebook_url` VARCHAR(191) NULL,
    ADD COLUMN `gender` ENUM('Male', 'Female', 'Other') NULL,
    ADD COLUMN `japanese_ability` ENUM('N1', 'N2', 'N3', 'N4', 'N5', 'None') NULL,
    ADD COLUMN `nearest_station` VARCHAR(191) NULL,
    ADD COLUMN `residence_status` ENUM('Permanent_Resident', 'Work_Visa', 'Student_Visa', 'Spouse_Visa', 'Other') NULL,
    ADD COLUMN `resume_type` VARCHAR(191) NULL,
    ADD COLUMN `working_days` JSON NULL;
