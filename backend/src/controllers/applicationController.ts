import { Request, Response, NextFunction } from "express";
import {
  createApplication,
  fetchApplications,
  fetchApplicationById,
  removeApplication,
  patchApplication as patchApplicationService,
  fetchTalentPool,
} from "../services/application.service";

export const postApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const application = await createApplication(req.body);
    res.status(201).json({ message: "Application submitted successfully", data: application });
  } catch (err) {
    next(err);
  }
};

export const getApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobIdRaw = req.query.job_id;
    const jobId =
      typeof jobIdRaw === "string" && /^\d+$/.test(jobIdRaw)
        ? parseInt(jobIdRaw, 10)
        : undefined;
    const applications = await fetchApplications(jobId);
    res.status(200).json({ message: "Applications fetched successfully", data: applications });
  } catch (err) {
    next(err);
  }
};

export const getApplicationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id: number = Number(req.params.id);
    const application = await fetchApplicationById(id);
    res.status(200).json({ message: `Application with id ${id} fetched successfully`, data: application });
  } catch (err) {
    next(err);
  }
};

export const getTalentPool = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const applications = await fetchTalentPool();
    res.status(200).json({ message: "Talent pool fetched successfully", data: applications });
  } catch (err) {
    next(err);
  }
};

export const patchApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id: number = Number(req.params.id);
    const updated = await patchApplicationService(id, req.body);
    res.status(200).json({ message: `Application with id ${id} updated successfully`, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id: number = Number(req.params.id);
    const deleted = await removeApplication(id);
    res.status(200).json({ message: `Application with id ${id} deleted successfully`, data: deleted });
  } catch (err) {
    next(err);
  }
};
