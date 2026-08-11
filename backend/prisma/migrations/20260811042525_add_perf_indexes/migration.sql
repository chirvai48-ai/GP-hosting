-- CreateIndex
CREATE INDEX `Application_status_idx` ON `Application`(`status`);

-- CreateIndex
CREATE INDEX `Application_stage_idx` ON `Application`(`stage`);

-- CreateIndex
CREATE INDEX `Application_created_at_idx` ON `Application`(`created_at`);

-- CreateIndex
CREATE INDEX `candidate_inquiry_state_idx` ON `candidate_inquiry`(`state`);

-- CreateIndex
CREATE INDEX `candidate_inquiry_created_at_idx` ON `candidate_inquiry`(`created_at`);

-- CreateIndex
CREATE INDEX `ContactRequest_status_idx` ON `ContactRequest`(`status`);

-- CreateIndex
CREATE INDEX `ContactRequest_created_at_idx` ON `ContactRequest`(`created_at`);

-- CreateIndex
CREATE INDEX `Job_status_idx` ON `Job`(`status`);

-- CreateIndex
CREATE INDEX `Job_created_at_idx` ON `Job`(`created_at`);

-- CreateIndex
CREATE INDEX `News_status_idx` ON `News`(`status`);

-- CreateIndex
CREATE INDEX `News_published_at_idx` ON `News`(`published_at`);
