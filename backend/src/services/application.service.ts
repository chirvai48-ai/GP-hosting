import { prisma } from "../lib/prisma";
import { putUrl, getUrl, deleteObject } from "../configs/cloudflare";
import type {
  createApplication as createApplicationInput,
  updateApplication as updateApplicationInput,
} from "../schemas/application.schema";
import { JapaneseAbility } from "../generated/prisma/enums";

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

export const fetchApplications = async (jobId?: number) => {
  const applications = await prisma.application.findMany({
    where: {
      status: { not: "TalentPool" },
      ...(jobId && { job_id: jobId }),
    },
    include: { job: true },
    orderBy: { created_at: "desc" },
  });

  return Promise.all(
    applications.map(async (app) => {
      const resume_url = await getUrl(BUCKET, `${RESUME_PREFIX}/${app.resume_key}`);
      return { ...app, resume_url };
    })
  );
};

interface TalentPoolFilters {
  search?: string;
  location?: string;
  japanese_ability?: string;
  job_category?: string;
}

export const fetchTalentPool = async (filters: TalentPoolFilters = {}) => {
  const { search, location, japanese_ability, job_category } = filters;

  const applications = await prisma.application.findMany({
    where: {
      status: "TalentPool",
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
    },
    include: { job: { include: { job_category: true } } },
    orderBy: { updated_at: "desc" },
  });

  return Promise.all(
    applications.map(async (app) => {
      const resume_url = await getUrl(BUCKET, `${RESUME_PREFIX}/${app.resume_key}`);
      return { ...app, resume_url };
    })
  );
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

export const fetchApplicationStats = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const trendCutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  const [stageGroups, talentPoolCount, hiredThisMonth, totalApplications, recentApplications] =
    await Promise.all([
      prisma.application.groupBy({
        by: ["stage"],
        _count: true,
        where: { status: { not: "TalentPool" } },
      }),
      prisma.application.count({ where: { status: "TalentPool" } }),
      prisma.application.count({ where: { stage: "Hired", updated_at: { gte: startOfMonth } } }),
      prisma.application.count(),
      prisma.application.findMany({
        where: { created_at: { gte: trendCutoff } },
        select: { created_at: true },
      }),
    ]);

  const stageCounts = Object.fromEntries(
    stageGroups.map((g) => [g.stage, g._count])
  ) as Record<string, number>;

  const weeklyTrend: Record<string, number> = {};
  for (const { created_at } of recentApplications) {
    const weekStart = new Date(created_at);
    weekStart.setUTCHours(0, 0, 0, 0);
    weekStart.setUTCDate(weekStart.getUTCDate() - weekStart.getUTCDay());
    const key = weekStart.toISOString().slice(0, 10);
    weeklyTrend[key] = (weeklyTrend[key] ?? 0) + 1;
  }

  return {
    stageCounts,
    talentPoolCount,
    hiredThisMonth,
    totalApplications,
    weeklyTrend: Object.entries(weeklyTrend)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([weekStart, count]) => ({ weekStart, count })),
  };
};

export const removeApplication = async (id: number) => {
  const application = await prisma.application.findUnique({ where: { id } });

  if (application?.resume_key) {
    await deleteObject(BUCKET, `${RESUME_PREFIX}/${application.resume_key}`);
  }

  return prisma.application.delete({ where: { id } });
};
