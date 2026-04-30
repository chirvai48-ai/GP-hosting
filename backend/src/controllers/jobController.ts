import { Request, Response, NextFunction } from "express";
import { createJobs,fetchJobs,fetchJobsById,removeJobs, patchJobs } from "../services/job.service";
export const getJobs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const jobs = await fetchJobs()
    res.status(200).json({
        message : "Job fetched successfully",
        data : jobs
    })
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
