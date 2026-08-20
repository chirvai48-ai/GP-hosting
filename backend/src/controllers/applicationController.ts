import { Request, Response, NextFunction } from "express";
import {
  createApplication,
  fetchApplications,
  fetchApplicationById,
  removeApplication,
  patchApplication as patchApplicationService,
  fetchTalentPool,
  fetchApplicationStats,
  fetchApplicationTrend,
  fetchNewApplicationCountsByJob,
  type TrendGranularity,
} from "../services/application.service";
import {
  fetchApplicationForResume,
  generateResumeXlsx,
} from "../services/resume.service";
import { parsePagination, paginatedResponse } from "../utils/pagination";
import { ApplicationStage } from "../generated/prisma/enums";

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

    const rawStage = req.query.stage;
    const validStages = Object.values(ApplicationStage);
    if (rawStage !== undefined && !validStages.includes(rawStage as ApplicationStage)) {
      res.status(400).json({ message: `Invalid stage. Must be one of: ${validStages.join(", ")}` });
      return;
    }
    const stage = typeof rawStage === "string" ? (rawStage as ApplicationStage) : undefined;

    const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>);
    const { items, total } = await fetchApplications(jobId, stage, { skip, take: limit });
    res.status(200).json(
      paginatedResponse("Applications fetched successfully", items, total, page, limit)
    );
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
    const { search, location, japanese_ability, job_category } =
      req.query as Record<string, string | undefined>;
    const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>);
    const { items, total } = await fetchTalentPool(
      { search, location, japanese_ability, job_category },
      { skip, take: limit }
    );
    res.status(200).json(
      paginatedResponse("Talent pool fetched successfully", items, total, page, limit)
    );
  } catch (err) {
    next(err);
  }
};

export const getApplicationStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobIdRaw = req.query.job_id;
    const jobId =
      typeof jobIdRaw === "string" && /^\d+$/.test(jobIdRaw)
        ? parseInt(jobIdRaw, 10)
        : undefined;
    const stats = await fetchApplicationStats(req.admin!.id, jobId);
    res.status(200).json({ message: "Application stats fetched successfully", data: stats });
  } catch (err) {
    next(err);
  }
};

const VALID_GRANULARITIES: TrendGranularity[] = ["monthly", "quarterly", "yearly"];

export const getApplicationTrend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const granularity = req.query.granularity as string | undefined;
    if (!granularity || !VALID_GRANULARITIES.includes(granularity as TrendGranularity)) {
      res.status(400).json({
        message: `Invalid or missing granularity. Must be one of: ${VALID_GRANULARITIES.join(", ")}`,
      });
      return;
    }

    const currentYear = new Date().getUTCFullYear();
    const yearRaw = req.query.year;
    const year =
      typeof yearRaw === "string" && /^\d{4}$/.test(yearRaw) ? Number(yearRaw) : currentYear;

    if (granularity === "monthly") {
      const monthRaw = req.query.month;
      const month = typeof monthRaw === "string" ? Number(monthRaw) : NaN;
      if (!Number.isInteger(month) || month < 1 || month > 12) {
        res.status(400).json({ message: "month is required and must be 1-12 for monthly granularity" });
        return;
      }
      const trend = await fetchApplicationTrend({ granularity: "monthly", year, month });
      res.status(200).json({ message: "Application trend fetched successfully", data: trend });
      return;
    }

    if (granularity === "quarterly") {
      const quarterRaw = req.query.quarter;
      const quarter = typeof quarterRaw === "string" ? Number(quarterRaw) : NaN;
      if (!Number.isInteger(quarter) || quarter < 1 || quarter > 4) {
        res.status(400).json({ message: "quarter is required and must be 1-4 for quarterly granularity" });
        return;
      }
      const trend = await fetchApplicationTrend({ granularity: "quarterly", year, quarter });
      res.status(200).json({ message: "Application trend fetched successfully", data: trend });
      return;
    }

    const trend = await fetchApplicationTrend({ granularity: "yearly", year });
    res.status(200).json({ message: "Application trend fetched successfully", data: trend });
  } catch (err) {
    next(err);
  }
};

export const getNewApplicationCountsByJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const counts = await fetchNewApplicationCountsByJob(req.admin!.id);
    res.status(200).json({ message: "New application counts fetched successfully", data: counts });
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

export const exportResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const app = await fetchApplicationForResume(id);
    if (!app) {
      res.status(404).json({ message: `Application with id ${id} not found` });
      return;
    }
    const buffer = await generateResumeXlsx(app);
    const safeName = app.full_name.replace(/[^a-zA-Z0-9_-]+/g, "_");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeName}_resume.xlsx"`
    );
    res.send(buffer);
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
