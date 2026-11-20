// Typed catalogue of everything that can be announced to Google Chat.
//
// Adding an event means adding a variant here, a card builder in cards.ts and a
// case in index.ts's dispatcher — the compiler points at the two it still needs.

import type { Application, Job, CandidateInquiry, ContactRequest } from "../../generated/prisma/client";

/** Which Chat space an event belongs in. One webhook URL per channel. */
export type Channel = "applications" | "inquiries" | "digest";

export type ApplicationWithJob = Application & { job: Pick<Job, "id" | "title"> };

export interface DailyDigest {
  /** Applications created in the last 24h, excluding talent-pool rows. */
  newApplications: number;
  /** Pipeline head-count keyed by ApplicationStage. */
  stageCounts: Record<string, number>;
  /** Company inquiries still sitting in Open. */
  openCompanyInquiries: number;
  /** Candidate inquiries still in New. */
  newCandidateInquiries: number;
}

export type NotificationEvent =
  | { type: "application.created"; application: ApplicationWithJob }
  | { type: "inquiry.candidate_created"; inquiry: CandidateInquiry }
  | { type: "inquiry.company_created"; inquiry: ContactRequest }
  | { type: "digest.daily"; digest: DailyDigest };

export const CHANNEL_BY_EVENT: Record<NotificationEvent["type"], Channel> = {
  "application.created": "applications",
  "inquiry.candidate_created": "inquiries",
  "inquiry.company_created": "inquiries",
  "digest.daily": "digest",
};
