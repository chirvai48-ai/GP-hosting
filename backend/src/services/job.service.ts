import { NextFunction } from "express";
import { prisma } from "../lib/prisma";
import type { createJob, updateJob } from "../schemas/job.schema";
import { Job as PrismaJob } from "../generated/prisma/client";
import { putUrl, deleteObject, getUrl } from "../configs/cloudflare";
export const createJobs = async (jobs: createJob): Promise<PrismaJob& { signed_url: string }> => {
  const { languages, technical_skills, job_category, ...rest } = jobs;

  const signed_url = await putUrl("glowingpartner",`vacancy/${jobs.image_key}`,`${jobs.image_type}`)

  const result = await prisma.job.create({
    data: {
      ...rest,
      shift_start: new Date(`1970-01-01T${jobs.shift_start}:00.000Z`),
      shift_end: new Date(`1970-01-01T${jobs.shift_end}:00.000Z`),
      job_category: {
        connectOrCreate: {
          where: { name: job_category },
          create: { name: job_category },
        },
      },
      ...(languages?.length && {
        languages: {
          connectOrCreate: languages.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      }),
      ...(technical_skills?.length && {
        technical_skills: {
          connectOrCreate: technical_skills.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      }),
    },
  });

  return {...result,signed_url:signed_url};
};

export const fetchJobs = async () => {
  const jobs = await prisma.job.findMany({
    include: {
      job_category: true,
      languages: true,
      technical_skills: true,
      _count: { select: { applications: true } },
    },
  });

  return Promise.all(
    jobs.map(async (job) => {
      if (!job.image_key) return job;
      const image_url = await getUrl("glowingpartner", `vacancy/${job.image_key}`);
      return { ...job, image_url };
    })
  );
};

export const fetchJobsById = async (id: number): Promise<PrismaJob[]> => {
  const job = await prisma.job.findMany({
    where: {
      id: {
        equals: id,
      },
    },
  });
  return job;
};

export const fetchJobStats = async () => {
  const [statusGroups, totalJobs] = await Promise.all([
    prisma.job.groupBy({ by: ["status"], _count: true }),
    prisma.job.count(),
  ]);

  const statusCounts = Object.fromEntries(
    statusGroups.map((g) => [g.status, g._count])
  ) as Record<string, number>;

  return { statusCounts, totalJobs };
};

export const removeJobs = async (id: number) => {
  const job = await prisma.job.findUnique({ where: { id } });

  if (job?.image_key) {
    await deleteObject("glowingpartner", `vacancy/${job.image_key}`);
  }

  const deletedJob = await prisma.job.delete({ where: { id } });
  return deletedJob;
};

export const patchJobs = async (id: number, data: updateJob) => {
  const { job_category, languages, technical_skills, ...rest } = data;
  const updatedJob = await prisma.job.update({
    where: {
      id: id,
    },
    data: {
      ...rest,
      ...(data.shift_start !== undefined && {shift_start: new Date(`1970-01-01T${data.shift_start}:00.000Z`)}),
      ...(data.shift_end !== undefined && {shift_end: new Date(`1970-01-01T${data.shift_end}:00.000Z`)}),
      ...(job_category?.length && {
        job_category: {
          connectOrCreate: {
            where: { name: job_category },
            create: { name: job_category },
          },
        },
      }),
      ...(languages?.length && {
        languages: {
          connectOrCreate: languages.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      }),
      ...(technical_skills?.length && {
        technical_skills: {
          connectOrCreate: technical_skills.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      }),
    },
  });
  return updatedJob;
};
