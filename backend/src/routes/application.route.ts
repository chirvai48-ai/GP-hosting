import { Router } from "express";
import {
  postApplication,
  getApplications,
  getApplicationById,
  deleteApplication,
} from "../controllers/applicationController";
import { validateCreate } from "../middlewares/validate";
import { createApplicationSchema } from "../schemas/application.schema";

export const applicationRouter = Router();

applicationRouter.get("/", getApplications);
applicationRouter.get("/:id", getApplicationById);
applicationRouter.post("/", validateCreate(createApplicationSchema), postApplication);
applicationRouter.delete("/:id", deleteApplication);

export default applicationRouter;
