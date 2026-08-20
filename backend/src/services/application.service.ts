import { prisma } from "../lib/prisma";
import { putUrl, getUrl, deleteObject } from "../configs/cloudflare";
import type {
  createApplication as createApplicationInput,
  updateApplication as updateApplicationInput,
} from "../schemas/application.schema";
import { JapaneseAbility, ApplicationStage } from "../generated/prisma/enums";
import {
  DEFAULT_LIMIT,
  type PaginationParams,
} from "../utils/pagination";

const BUCKET = "glowingpartner";
const RESUME_PREFIX = "resume";

export const createApplication = async (data: createApplicationInput) => {
  const signed_url = await putUrl(BUCKET, `${RESUME_PREFIX}/${data.resume_key}`, data.resume_type);

  const { job_id, date_of_birth, ...rest } = data;

  const result = await prisma.application.create({
    data: {
      ...rest,
      date_of_birth: new Date(date_of_birth),
      job: { connect: { id: job_id } },
    },
    include: { job: true },
  });

  return { ...result, signed_url };
};

export const fetchApplications = async (
  jobId?: number,
  stage?: ApplicationStage,
  pagination: Pick<PaginationParams, "skip" | "take"> = { skip: 0, take: DEFAULT_LIMIT }
) => {
  const where = {
    status: { not: "TalentPool" as const },
    ...(jobId && { job_id: jobId }),
    ...(stage && { stage }),
  };

  const [applications, total] = await prisma.$transaction([
    prisma.application.findMany({
      where,
      include: { job: true },
      orderBy: [{ created_at: "desc" }, { id: "desc" }],
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.application.count({ where }),
  ]);

  const items = await Promise.all(
    applications.map(async (app) => {
      const resume_url = await getUrl(BUCKET, `${RESUME_PREFIX}/${app.resume_key}`);
      return { ...app, resume_url };
    })
  );

  return { items, total };
};

interface TalentPoolFilters {
  search?: string;
  location?: string;
  japanese_ability?: string;
  job_category?: string;
}

export const fetchTalentPool = async (
  filters: TalentPoolFilters = {},
  pagination: Pick<PaginationParams, "skip" | "take"> = { skip: 0, take: DEFAULT_LIMIT }
) => {
  const { search, location, japanese_ability, job_category } = filters;

  const where = {
    status: "TalentPool" as const,
    ...(search && {
      OR: [
        { full_name: { contains: search } },
        { email: { contains: search } },
      ],
    }),
    ...(location && { current_address: { contains: location } }),
    ...(japanese_ability && { japanese_ability: japanese_ability as JapaneseAbility }),
    ...(job_category && {
      job: { job_category: { name: { contains: job_category } } },
    }),
  };

  const [applications, total] = await prisma.$transaction([
    prisma.application.findMany({
      where,
      include: { job: { include: { job_category: true } } },
      orderBy: [{ updated_at: "desc" }, { id: "desc" }],
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.application.count({ where }),
  ]);

  const items = await Promise.all(
    applications.map(async (app) => {
      const resume_url = await getUrl(BUCKET, `${RESUME_PREFIX}/${app.resume_key}`);
      return { ...app, resume_url };
    })
  );

  return { items, total };
};

export const patchApplication = async (id: number, data: updateApplicationInput) => {
  const { date_of_birth, ...rest } = data;
  return prisma.application.update({
    where: { id },
    data: {
      ...rest,
      ...(date_of_birth && { date_of_birth: new Date(date_of_birth) }),
    },
  });
};

export const fetchApplicationById = async (id: number) => {
  const application = await prisma.application.findUnique({
    where: { id },
    include: { job: true },
  });

  if (!application) return null;

  const resume_url = await getUrl(BUCKET, `${RESUME_PREFIX}/${application.resume_key}`);
  return { ...application, resume_url };
};

export const cleanupRejectedApplications = async () => {
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const stale = await prisma.application.findMany({
    where: { stage: "Rejected", updated_at: { lt: cutoff } },
    select: { id: true, resume_key: true },
  });
  await Promise.all(
    stale
      .filter((app) => app.resume_key)
      .map((app) =>
        deleteObject(BUCKET, `${RESUME_PREFIX}/${app.resume_key!}`).catch(() => null)
      )
  );
  await prisma.application.deleteMany({ where: { id: { in: stale.map((a) => a.id) } } });
  return stale.length;
};

export const fetchApplicationStats = async (adminId: string, jobId?: number) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { lastSeenApplicationsAt: true },
  });
  const lastSeenApplicationsAt = admin?.lastSeenApplicationsAt ?? new Date(0);

  const jobScope = jobId ? { job_id: jobId } : {};

  const [stageGroups, talentPoolCount, hiredThisMonth, totalApplications, newApplicationsCount] =
    await Promise.all([
      prisma.application.groupBy({
        by: ["stage"],
        _count: true,
        where: { status: { not: "TalentPool" }, ...jobScope },
      }),
      prisma.application.count({ where: { status: "TalentPool", ...jobScope } }),
      prisma.application.count({
        where: { stage: "Hired", updated_at: { gte: startOfMonth }, ...jobScope },
      }),
      prisma.application.count({ where: { ...jobScope } }),
      prisma.application.count({
        where: { status: { not: "TalentPool" }, created_at: { gt: lastSeenApplicationsAt }, ...jobScope },
      }),
    ]);

  const stageCounts = Object.fromEntries(
    stageGroups.map((g) => [g.stage, g._count])
  ) as Record<string, number>;

  return {
    stageCounts,
    talentPoolCount,
    hiredThisMonth,
    totalApplications,
    newApplicationsCount,
  };
};

export type TrendGranularity = "monthly" | "quarterly" | "yearly";

function bucketKey(date: Date, granularity: TrendGranularity): string {
  if (granularity === "monthly") {
    return date.toISOString().slice(0, 10); // YYYY-MM-DD
  }
  if (granularity === "yearly") {
    return date.toISOString().slice(0, 7); // YYYY-MM
  }
  // quarterly -> bucket by week (Sunday-start, UTC)
  const weekStart = new Date(date);
  weekStart.setUTCHours(0, 0, 0, 0);
  weekStart.setUTCDate(weekStart.getUTCDate() - weekStart.getUTCDay());
  return weekStart.toISOString().slice(0, 10);
}

// Zero-fills every bucket in [rangeStart, rangeEnd) so the chart shows a
// realistic, gap-free time axis instead of only the days/weeks/months that
// happen to have applications.
function buildBucketLabels(
  granularity: TrendGranularity,
  rangeStart: Date,
  rangeEnd: Date
): string[] {
  const labels: string[] = [];
  if (granularity === "monthly") {
    const d = new Date(rangeStart);
    while (d < rangeEnd) {
      labels.push(d.toISOString().slice(0, 10));
      d.setUTCDate(d.getUTCDate() + 1);
    }
  } else if (granularity === "yearly") {
    const d = new Date(rangeStart);
    while (d < rangeEnd) {
      labels.push(d.toISOString().slice(0, 7));
      d.setUTCMonth(d.getUTCMonth() + 1);
    }
  } else {
    const d = new Date(rangeStart);
    d.setUTCDate(d.getUTCDate() - d.getUTCDay()); // snap back to the week's Sunday
    while (d < rangeEnd) {
      labels.push(d.toISOString().slice(0, 10));
      d.setUTCDate(d.getUTCDate() + 7);
    }
  }
  return labels;
}

export const fetchApplicationTrend = async (params: {
  granularity: TrendGranularity;
  year: number;
  month?: number; // 1-12, required for "monthly"
  quarter?: number; // 1-4, required for "quarterly"
}) => {
  const { granularity, year, month, quarter } = params;

  let rangeStart: Date;
  let rangeEnd: Date;

  if (granularity === "monthly") {
    rangeStart = new Date(Date.UTC(year, month! - 1, 1));
    rangeEnd = new Date(Date.UTC(year, month!, 1));
  } else if (granularity === "quarterly") {
    const quarterStartMonth = (quarter! - 1) * 3;
    rangeStart = new Date(Date.UTC(year, quarterStartMonth, 1));
    rangeEnd = new Date(Date.UTC(year, quarterStartMonth + 3, 1));
  } else {
    rangeStart = new Date(Date.UTC(year, 0, 1));
    rangeEnd = new Date(Date.UTC(year + 1, 0, 1));
  }

  const applications = await prisma.application.findMany({
    where: { created_at: { gte: rangeStart, lt: rangeEnd } },
    select: { created_at: true },
  });

  const counts: Record<string, number> = {};
  for (const { created_at } of applications) {
    const key = bucketKey(created_at, granularity);
    counts[key] = (counts[key] ?? 0) + 1;
  }

  const trend = buildBucketLabels(granularity, rangeStart, rangeEnd).map((label) => ({
    label,
    count: counts[label] ?? 0,
  }));

  return { granularity, year, month, quarter, trend };
};

export const fetchNewApplicationCountsByJob = async (adminId: string) => {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { lastSeenApplicationsAt: true },
  });
  const lastSeenApplicationsAt = admin?.lastSeenApplicationsAt ?? new Date(0);

  const groups = await prisma.application.groupBy({
    by: ["job_id"],
    _count: true,
    where: { status: { not: "TalentPool" }, created_at: { gt: lastSeenApplicationsAt } },
  });

  return Object.fromEntries(groups.map((g) => [g.job_id, g._count])) as Record<number, number>;
};

export const removeApplication = async (id: number) => {
  const application = await prisma.application.findUnique({ where: { id } });

  if (application?.resume_key) {
    await deleteObject(BUCKET, `${RESUME_PREFIX}/${application.resume_key}`);
  }

  return prisma.application.delete({ where: { id } });
};
