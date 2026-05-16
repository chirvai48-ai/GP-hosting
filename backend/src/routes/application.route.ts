import { Router } from "express";
import {
  postApplication,
  getApplications,
  getApplicationById,
  patchApplication,
  deleteApplication,
  getTalentPool,
} from "../controllers/applicationController";
import { validateCreate, validateUpdate } from "../middlewares/validate";
import { createApplicationSchema, updateApplicationSchema } from "../schemas/application.schema";

export const applicationRouter = Router();

applicationRouter.get("/", getApplications);
applicationRouter.get("/talent-pool", getTalentPool);
applicationRouter.get("/:id", getApplicationById);
applicationRouter.post("/", validateCreate(createApplicationSchema), postApplication);
applicationRouter.patch("/:id", validateUpdate(updateApplicationSchema), patchApplication);
applicationRouter.delete("/:id", deleteApplication);

export default applicationRouter;
