import { prisma } from "../lib/prisma";
import { putUrl, getUrl, deleteObject } from "../configs/cloudflare";
import type {
  createApplication as createApplicationInput,
  updateApplication as updateApplicationInput,
} from "../schemas/application.schema";

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

export const fetchTalentPool = async () => {
  const applications = await prisma.application.findMany({
    where: { status: "TalentPool" },
    include: { job: true },
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
  for (const app of stale) {
    if (app.resume_key) {
      try {
        await deleteObject(BUCKET, `${RESUME_PREFIX}/${app.resume_key}`);
      } catch {
        // R2 errors shouldn't block the DB delete — log via console once we have a logger
      }
    }
    await prisma.application.delete({ where: { id: app.id } });
  }
  return stale.length;
};

export const removeApplication = async (id: number) => {
  const application = await prisma.application.findUnique({ where: { id } });

  if (application?.resume_key) {
    await deleteObject(BUCKET, `${RESUME_PREFIX}/${application.resume_key}`);
  }

  return prisma.application.delete({ where: { id } });
};
