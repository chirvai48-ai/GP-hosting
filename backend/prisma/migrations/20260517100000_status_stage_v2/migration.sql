-- 1. Widen the `status` enum to allow both old and new values during data migration.
ALTER TABLE `Application` MODIFY `status` ENUM('Active','OnHold','TalentPool','Rejected') NOT NULL DEFAULT 'Active';

-- 2. Widen the `stage` enum to include the new 'Rejected' value.
ALTER TABLE `Application` MODIFY `stage` ENUM('Pending','ApplicantCalled','InterviewScheduling','Hired','Rejected') NOT NULL DEFAULT 'Pending';

-- 3. Migrate any rows that were status='Rejected' into stage='Rejected', status='Active'.
UPDATE `Application` SET `stage` = 'Rejected', `status` = 'Active' WHERE `status` = 'Rejected';

-- 4. Narrow `status` enum, dropping 'Rejected'.
ALTER TABLE `Application` MODIFY `status` ENUM('Active','OnHold','TalentPool') NOT NULL DEFAULT 'Active';
