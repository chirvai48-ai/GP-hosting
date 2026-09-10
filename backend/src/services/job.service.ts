import { NextFunction } from "express";
import { prisma } from "../lib/prisma";
import type { createJob, updateJob } from "../schemas/job.schema";
import { Job as PrismaJob } from "../generated/prisma/client";
import { putUrl, deleteObject, getUrl } from "../configs/cloudflare";
import {
  DEFAULT_LIMIT,
  type PaginationParams,
} from "../utils/pagination";
export const getJobImageUploadUrl = async (image_key: string, image_type: string) =>
  putUrl("glowingpartner", `vacancy/${image_key}`, image_type);

export const createJobs = async (jobs: createJob): Promise<PrismaJob> => {
  const { languages, technical_skills, job_category, ...rest } = jobs;

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

  return result;
};

export interface JobFilters {
  keyword?: string;
  city?: string;
  exp?: number;
  salaryMin?: number; // yen
  salaryMax?: number; // yen
  schedule?: string[]; // active schedule filter keys
  employment?: string[]; // active employment filter keys
}

const SCHEDULE_CONTRACT_MAP: Record<string, string[]> = {
  full_time: ["Full_time"],
  part_time: ["Part_time"],
  internship: ["Internship"],
  contract: [], // no valid DB enum value — matches nothing
};

// Translates the public job-search filters (mirrored from the old client-side
// applyJobFilters) into a Prisma where clause.
function buildJobWhere(status?: string | string[], filters?: JobFilters) {
  const where: any = {};
  if (Array.isArray(status)) {
    if (status.length) where.status = { in: status };
  } else if (status) {
    where.status = status;
  }
  if (!filters) return where;

  const tokens = filters.keyword?.trim().toLowerCase().split(/\s+/).filter(Boolean) ?? [];
  const and: any[] = [];
  if (tokens.length) {
    and.push({
      OR: tokens.map((token) => ({
        OR: [
          { title: { contains: token } },
          { location: { contains: token } },
          { job_category: { name: { contains: token } } },
          { technical_skills: { some: { name: { contains: token } } } },
          { languages: { some: { name: { contains: token } } } },
        ],
      })),
    });
  }

  if (filters.city) where.location = { equals: filters.city };
  if (filters.exp !== undefined) {
    where.experience = filters.exp === 6 ? { gte: 5 } : filters.exp;
  }
  if (filters.salaryMin !== undefined || filters.salaryMax !== undefined) {
    where.salary_max = { gte: filters.salaryMin ?? 0 };
    where.salary_min = { lte: filters.salaryMax ?? Number.MAX_SAFE_INTEGER };
  }

  const contracts = (filters.schedule ?? []).flatMap((s) => SCHEDULE_CONTRACT_MAP[s] ?? []);
  if (contracts.length) where.contract = { in: contracts };

  const employment = (filters.employment ?? []).map((e) => {
    if (e === "fivedays") return { workdays: 5 };
    if (e === "sixdays") return { workdays: 6 };
    if (e === "shift_based") return { shift_start: { not: null }, shift_end: { not: null } };
    if (e === "flexible") return { workdays: null, shift_start: null };
    return null;
  }).filter(Boolean);
  if (employment.length) and.push({ OR: employment });

  if (and.length) where.AND = and;
  return where;
}

export const fetchJobs = async (
  status?: string | string[],
  filters: JobFilters | null = null,
  pagination: Pick<PaginationParams, "skip" | "take"> = { skip: 0, take: DEFAULT_LIMIT }
) => {
  const where = buildJobWhere(status, filters ?? undefined);

  const [jobs, total] = await prisma.$transaction([
    prisma.job.findMany({
      where,
      orderBy: [{ created_at: "desc" }, { id: "desc" }],
      include: {
        job_category: true,
        languages: true,
        technical_skills: true,
        _count: { select: { applications: true } },
      },
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.job.count({ where }),
  ]);

  const items = await Promise.all(
    jobs.map(async (job) => {
      if (!job.image_key) return job;
      const image_url = await getUrl("glowingpartner", `vacancy/${job.image_key}`);
      return { ...job, image_url };
    })
  );

  return { items, total };
};

export const fetchJobsById = async (id: number) => {
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      job_category: true,
      languages: true,
      technical_skills: true,
      _count: { select: { applications: true } },
    },
  });
  if (!job) return null;
  if (!job.image_key) return job;
  const image_url = await getUrl("glowingpartner", `vacancy/${job.image_key}`);
  return { ...job, image_url };
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

  let signed_url: string | undefined;
  let previousImageKey: string | null | undefined;
  if (data.image_key !== undefined) {
    const existing = await prisma.job.findUnique({ where: { id }, select: { image_key: true } });
    previousImageKey = existing?.image_key;
    signed_url = await putUrl("glowingpartner", `vacancy/${data.image_key}`, `${data.image_type}`);
  }

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

  if (previousImageKey && previousImageKey !== data.image_key) {
    await deleteObject("glowingpartner", `vacancy/${previousImageKey}`);
  }

  return { ...updatedJob, signed_url };
};
