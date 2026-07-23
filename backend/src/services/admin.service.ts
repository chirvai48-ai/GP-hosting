import { prisma } from "../lib/prisma";

export type LastSeenScope = "applications" | "messages";

export const fetchLastSeen = async (adminId: string) => {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { lastSeenApplicationsAt: true, lastSeenMessagesAt: true },
  });
  return {
    lastSeenApplicationsAt: admin?.lastSeenApplicationsAt ?? null,
    lastSeenMessagesAt: admin?.lastSeenMessagesAt ?? null,
  };
};

export const updateLastSeen = async (adminId: string, scope: LastSeenScope) => {
  const field = scope === "applications" ? "lastSeenApplicationsAt" : "lastSeenMessagesAt";
  const admin = await prisma.admin.update({
    where: { id: adminId },
    data: { [field]: new Date() },
    select: { lastSeenApplicationsAt: true, lastSeenMessagesAt: true },
  });
  return admin;
};
