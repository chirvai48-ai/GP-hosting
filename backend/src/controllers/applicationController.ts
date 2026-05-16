import { Request, Response, NextFunction } from "express";
import {
  createApplication,
  fetchApplications,
  fetchApplicationById,
  removeApplication,
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
    const applications = await fetchApplications();
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

export const deleteApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id: number = Number(req.params.id);
    const deleted = await removeApplication(id);
    res.status(200).json({ message: `Application with id ${id} deleted successfully`, data: deleted });
  } catch (err) {
    next(err);
  }
};
