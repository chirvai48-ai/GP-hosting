-- 1. Widen the status enum so we can transition values safely without violating the column constraint.
ALTER TABLE `Application` MODIFY `status` ENUM('Pending', 'Reviewed', 'Accepted', 'Rejected', 'Active', 'OnHold', 'TalentPool') NOT NULL DEFAULT 'Pending';

-- 2. Add the new `stage` column (defaults to 'Pending' for every existing row).
ALTER TABLE `Application` ADD COLUMN `stage` ENUM('Pending', 'ApplicantCalled', 'InterviewScheduling', 'Hired') NOT NULL DEFAULT 'Pending';

-- 3. Preserve hiring info: rows that were `Accepted` move to stage = 'Hired' before we collapse the status enum.
UPDATE `Application` SET `stage` = 'Hired' WHERE `status` = 'Accepted';

-- 4. Collapse the legacy outcome values into the new `Active` umbrella status. `Rejected` stays as-is.
UPDATE `Application` SET `status` = 'Active' WHERE `status` IN ('Pending', 'Reviewed', 'Accepted');

-- 5. Now narrow the enum to the final set of values.
ALTER TABLE `Application` MODIFY `status` ENUM('Active', 'OnHold', 'TalentPool', 'Rejected') NOT NULL DEFAULT 'Active';

-- 6. Add the `updated_at` column. Use CURRENT_TIMESTAMP for existing rows so Prisma's @updatedAt has a baseline.
ALTER TABLE `Application` ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
