import { adminFetch } from "@/lib/adminFetch";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type LastSeenScope = "applications" | "messages";

export interface LastSeen {
  lastSeenApplicationsAt: string | null;
  lastSeenMessagesAt: string | null;
}

export async function getLastSeen(): Promise<{ data: LastSeen }> {
  const res = await adminFetch(`${API_URL}/api/admin/last-seen`);
  if (!res.ok) throw new Error("Failed to load last-seen state");
  return res.json();
}

export async function markSeen(scope: LastSeenScope): Promise<{ data: LastSeen }> {
  const res = await adminFetch(`${API_URL}/api/admin/last-seen`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scope }),
  });
  if (!res.ok) throw new Error("Failed to mark as seen");
  return res.json();
}
