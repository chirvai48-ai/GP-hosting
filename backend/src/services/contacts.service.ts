import { prisma } from "../lib/prisma";
import { putUrl, getUrl, deleteObject } from "../configs/cloudflare";
import type {
  createCompanyInquiry as createCompanyInquiryInput,
  updateCompanyInquiry as updateCompanyInquiryInput,
  createCandidateInquiry as createCandidateInquiryInput,
  updateCandidateInquiry as updateCandidateInquiryInput,
} from "../schemas/contact.schema";
import {
  DEFAULT_LIMIT,
  type PaginationParams,
} from "../utils/pagination";

const BUCKET = "glowingpartner";
const CANDIDATE_RESUME_PREFIX = "candidate-resume";

export const createCompanyInquiry = async (data: createCompanyInquiryInput) => {
  return prisma.contactRequest.create({ data });
};

export const fetchCompanyInquiries = async (
  pagination: Pick<PaginationParams, "skip" | "take"> = { skip: 0, take: DEFAULT_LIMIT }
) => {
  const [inquiries, total] = await prisma.$transaction([
    prisma.contactRequest.findMany({
      orderBy: [{ created_at: "desc" }, { id: "desc" }],
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.contactRequest.count(),
  ]);
  return { items: inquiries, total };
};

export const fetchCompanyInquiryById = async (id: number) => {
  return prisma.contactRequest.findUnique({ where: { id } });
};

export const patchCompanyInquiry = async (id: number, data: updateCompanyInquiryInput) => {
  return prisma.contactRequest.update({ where: { id }, data });
};

export const removeCompanyInquiry = async (id: number) => {
  return prisma.contactRequest.delete({ where: { id } });
};

export const createCandidateInquiry = async (data: createCandidateInquiryInput) => {
  const { resume_key, resume_type } = data;
  const signed_url =
    resume_key && resume_type
      ? await putUrl(BUCKET, `${CANDIDATE_RESUME_PREFIX}/${resume_key}`, resume_type)
      : undefined;

  const { date_of_birth, ...rest } = data;

  const result = await prisma.candidateInquiry.create({
    data: {
      ...rest,
      date_of_birth: new Date(date_of_birth),
    },
  });

  return { ...result, signed_url };
};

export const fetchCandidateInquiries = async (
  pagination: Pick<PaginationParams, "skip" | "take"> = { skip: 0, take: DEFAULT_LIMIT }
) => {
  const [inquiries, total] = await prisma.$transaction([
    prisma.candidateInquiry.findMany({
      orderBy: [{ created_at: "desc" }, { id: "desc" }],
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.candidateInquiry.count(),
  ]);

  const items = await Promise.all(
    inquiries.map(async (inquiry) => {
      const resume_url = inquiry.resume_key
        ? await getUrl(BUCKET, `${CANDIDATE_RESUME_PREFIX}/${inquiry.resume_key}`)
        : null;
      return { ...inquiry, resume_url };
    })
  );

  return { items, total };
};

export const fetchCandidateTalentPool = async (
  pagination: Pick<PaginationParams, "skip" | "take"> = { skip: 0, take: DEFAULT_LIMIT }
) => {
  const where = { state: "MovedToTalentPool" as const };

  const [inquiries, total] = await prisma.$transaction([
    prisma.candidateInquiry.findMany({
      where,
      orderBy: [{ moved_to_pool_at: "desc" }, { id: "desc" }],
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.candidateInquiry.count({ where }),
  ]);

  const items = await Promise.all(
    inquiries.map(async (inquiry) => {
      const resume_url = inquiry.resume_key
        ? await getUrl(BUCKET, `${CANDIDATE_RESUME_PREFIX}/${inquiry.resume_key}`)
        : null;
      return { ...inquiry, resume_url };
    })
  );

  return { items, total };
};

export const fetchCandidateInquiryById = async (id: number) => {
  const inquiry = await prisma.candidateInquiry.findUnique({ where: { id } });
  if (!inquiry) return null;

  const resume_url = inquiry.resume_key
    ? await getUrl(BUCKET, `${CANDIDATE_RESUME_PREFIX}/${inquiry.resume_key}`)
    : null;
  return { ...inquiry, resume_url };
};

export const patchCandidateInquiry = async (id: number, data: updateCandidateInquiryInput) => {
  const { date_of_birth, state, ...rest } = data;

  const stateTransition: Record<string, Date | null> = {};
  if (state === "MovedToTalentPool") {
    stateTransition.moved_to_pool_at = new Date();
    stateTransition.rejected_at = null;
  } else if (state === "Rejected") {
    stateTransition.rejected_at = new Date();
    stateTransition.moved_to_pool_at = null;
  } else if (state === "Reviewing" || state === "New") {
    stateTransition.moved_to_pool_at = null;
    stateTransition.rejected_at = null;
  }

  return prisma.candidateInquiry.update({
    where: { id },
    data: {
      ...rest,
      ...(date_of_birth && { date_of_birth: new Date(date_of_birth) }),
      ...(state && { state }),
      ...stateTransition,
    },
  });
};

export const fetchContactStats = async (adminId: string) => {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { lastSeenMessagesAt: true },
  });
  const lastSeenMessagesAt = admin?.lastSeenMessagesAt ?? new Date(0);

  const [
    openContactRequests,
    newCandidateInquiries,
    movedToTalentPool,
    newCompanyMessages,
    newCandidateMessages,
  ] = await Promise.all([
    prisma.contactRequest.count({ where: { status: "Open" } }),
    prisma.candidateInquiry.count({ where: { state: "New" } }),
    prisma.candidateInquiry.count({ where: { state: "MovedToTalentPool" } }),
    prisma.contactRequest.count({ where: { created_at: { gt: lastSeenMessagesAt } } }),
    prisma.candidateInquiry.count({ where: { created_at: { gt: lastSeenMessagesAt } } }),
  ]);

  return {
    openContactRequests,
    newCandidateInquiries,
    movedToTalentPool,
    newMessagesCount: newCompanyMessages + newCandidateMessages,
  };
};

export const removeCandidateInquiry = async (id: number) => {
  const inquiry = await prisma.candidateInquiry.findUnique({ where: { id } });

  if (inquiry?.resume_key) {
    try {
      await deleteObject(BUCKET, `${CANDIDATE_RESUME_PREFIX}/${inquiry.resume_key}`);
    } catch {
      // R2 errors shouldn't block the DB delete
    }
  }

  return prisma.candidateInquiry.delete({ where: { id } });
};
