import { Request, Response, NextFunction } from "express";
import { createJobs,fetchJobs,fetchJobsById,removeJobs, patchJobs, fetchJobStats, JobFilters } from "../services/job.service";
import { JobStatus } from "../generated/prisma/enums";
import {
  parsePagination,
  paginatedResponse,
} from "../utils/pagination";

const positiveInt = (v: unknown) => (typeof v === "string" && /^\d+$/.test(v) ? Number(v) : undefined);

function parseJobFilters(query: Record<string, unknown>): JobFilters | null {
  const filters: JobFilters = {};
  if (typeof query.keyword === "string") filters.keyword = query.keyword;
  if (typeof query.city === "string") filters.city = query.city;
  const exp = positiveInt(query.exp);
  const salaryMin = positiveInt(query.salary_min);
  const salaryMax = positiveInt(query.salary_max);
  if (exp !== undefined) filters.exp = exp;
  if (salaryMin !== undefined) filters.salaryMin = salaryMin * 1000;
  if (salaryMax !== undefined) filters.salaryMax = salaryMax * 1000;
  if (typeof query.schedule === "string" && query.schedule) filters.schedule = query.schedule.split(",");
  if (typeof query.employment === "string" && query.employment) filters.employment = query.employment.split(",");
  return Object.keys(filters).length ? filters : null;
}

export const getJobs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rawStatus = req.query.status;
    const validStatuses = Object.values(JobStatus);
    if (rawStatus !== undefined && !validStatuses.includes(rawStatus as JobStatus)) {
      res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
      return;
    }
    const status = typeof rawStatus === "string" ? rawStatus : undefined;
    const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>);
    const filters = parseJobFilters(req.query as Record<string, unknown>);
    const { items, total } = await fetchJobs(status, filters, { skip, take: limit });
    res.status(200).json(
      paginatedResponse("Job fetched successfully", items, total, page, limit)
    );
  } catch (error) {
    next(error);
  }
};

export const postJobs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const jobs = await createJobs(req.body);
    res.status(201).json(
        {
            message: "Job created successfully",
            data: jobs
        }
    )
  } catch (err) {
    next(err);
  }
};

export const getJobStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stats = await fetchJobStats();
    res.status(200).json({
      message: "Job stats fetched successfully",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id:number = Number(req.params.id)
    const jobs = await fetchJobsById(id)
    res.status(200).json({
        message: `Job with id ${id}  fetched successfully`,
        data: jobs
    })
  } catch (error) {
    next(error);
  }
};

export const updateJobs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const jobId:number = Number(req.params.id)
    const data = req.body
    const jobs = await patchJobs(jobId,data)
    res.status(200).json({
      message : "Job updated successfully ",
      data:jobs
    })
  } catch (error) {
    next(error);
  }
};

export const deleteJobs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id:number = Number(req.params.id)
    const deletedJob = await removeJobs(id)
    res.status(200).json({
        message : `Job with id ${id} deleted  successfully `,
        data : deletedJob
    })
  } catch (error) {
    next(error);
  }
};
