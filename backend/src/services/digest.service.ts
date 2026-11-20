import { prisma } from "../lib/prisma";
import type { DailyDigest } from "../lib/notifier";

/**
 * Aggregates the numbers behind the morning Chat digest.
 *
 * Deliberately separate from fetchApplicationStats: that one is per-admin and
 * keyed off lastSeenApplicationsAt (it answers "what's new *for you*"), which
 * has no meaning for a message posted to a shared space. This one is a plain
 * 24-hour window.
 */
export const buildDailyDigest = async (): Promise<DailyDigest> => {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [newApplications, stageGroups, openCompanyInquiries, newCandidateInquiries] =
    await Promise.all([
      prisma.application.count({
        where: { status: { not: "TalentPool" }, created_at: { gte: cutoff } },
      }),
      prisma.application.groupBy({
        by: ["stage"],
        _count: true,
        where: { status: { not: "TalentPool" } },
      }),
      prisma.contactRequest.count({ where: { status: "Open" } }),
      prisma.candidateInquiry.count({ where: { created_at: { gte: cutoff } } }),
    ]);

  return {
    newApplications,
    stageCounts: Object.fromEntries(stageGroups.map((g) => [g.stage, g._count])),
    openCompanyInquiries,
    newCandidateInquiries,
  };
};
