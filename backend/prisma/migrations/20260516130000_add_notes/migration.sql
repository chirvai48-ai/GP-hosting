-- CreateTable
CREATE TABLE `note` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` TEXT NOT NULL,
    `application_id` INTEGER NOT NULL,
    `created_by_admin_id` VARCHAR(191) NOT NULL,
    `last_edited_by_admin_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `note_application_id_idx`(`application_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `note` ADD CONSTRAINT `note_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `application`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `note` ADD CONSTRAINT `note_created_by_admin_id_fkey` FOREIGN KEY (`created_by_admin_id`) REFERENCES `admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `note` ADD CONSTRAINT `note_last_edited_by_admin_id_fkey` FOREIGN KEY (`last_edited_by_admin_id`) REFERENCES `admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
