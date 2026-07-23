import { Router } from "express";
import {
  postApplication,
  getApplications,
  getApplicationById,
  patchApplication,
  deleteApplication,
  getTalentPool,
  getApplicationStats,
  getNewApplicationCountsByJob,
  exportResume,
} from "../controllers/applicationController";
import { validateCreate, validateUpdate } from "../middlewares/validate";
import { requireAuth } from "../middlewares/requireAuth";
import { createApplicationSchema, updateApplicationSchema } from "../schemas/application.schema";

export const applicationRouter = Router();

applicationRouter.post("/", validateCreate(createApplicationSchema), postApplication);

applicationRouter.get("/", requireAuth, getApplications);
applicationRouter.get("/talent-pool", requireAuth, getTalentPool);
applicationRouter.get("/stats", requireAuth, getApplicationStats);
applicationRouter.get("/new-counts-by-job", requireAuth, getNewApplicationCountsByJob);
applicationRouter.get("/:id/resume.xlsx", requireAuth, exportResume);
applicationRouter.get("/:id", requireAuth, getApplicationById);
applicationRouter.patch("/:id", requireAuth, validateUpdate(updateApplicationSchema), patchApplication);
applicationRouter.delete("/:id", requireAuth, deleteApplication);

export default applicationRouter;
