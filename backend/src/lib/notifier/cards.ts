// Google Chat cardV2 builders.
//
// The card is the deliverable, not a teaser: every field the applicant filled
// in is rendered here, so a recruiter reading the space on their phone has the
// whole submission without opening the dashboard. The dashboard link exists for
// the one thing a card can't carry — the résumé file, which lives behind
// presigned R2 storage and admin auth.

import type { ApplicationWithJob, DailyDigest } from "./events";
import type { CandidateInquiry, ContactRequest } from "../../generated/prisma/client";

/** Cover letters are @db.Text and can run long; Chat messages cap at 32KB. */
const COVER_LETTER_LIMIT = 800;

/**
 * Absolute origin of the admin dashboard, or null when it isn't configured.
 *
 * Chat rejects a card whose openLink.url is relative with a 400, which would
 * lose the *entire* notification over a missing env var — so callers omit the
 * dashboard button rather than emit a relative href. A card with every field
 * and no button is still the whole submission; a 400 is nothing.
 */
const adminBaseUrl = (): string | null => {
  const raw = process.env.ADMIN_BASE_URL?.trim();
  if (!raw) return null;
  try {
    const { protocol } = new URL(raw);
    if (protocol !== "http:" && protocol !== "https:") return null;
  } catch {
    return null;
  }
  return raw.replace(/\/$/, "");
};

// ---- field formatting ----------------------------------------------------

/** Prisma enums use underscores (Permanent_Resident) — read them as words. */
const humanize = (value: string) => value.replace(/_/g, " ");

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

const formatDateTime = (date: Date) =>
  date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo", hour12: false });

const ageFrom = (dob: Date) => {
  const now = new Date();
  let age = now.getUTCFullYear() - dob.getUTCFullYear();
  const beforeBirthday =
    now.getUTCMonth() < dob.getUTCMonth() ||
    (now.getUTCMonth() === dob.getUTCMonth() && now.getUTCDate() < dob.getUTCDate());
  if (beforeBirthday) age -= 1;
  return age;
};

const truncate = (text: string, limit: number) =>
  text.length <= limit ? text : `${text.slice(0, limit).trimEnd()}… (truncated — full text in dashboard)`;

/** working_days is a Json column, so it arrives as unknown. */
const formatWorkingDays = (value: unknown) =>
  Array.isArray(value) && value.length > 0 ? value.join(", ") : null;

// ---- widget helpers ------------------------------------------------------

interface DecoratedText {
  decoratedText: { topLabel?: string; text: string; wrapText?: boolean };
}

/** Drops the widget entirely when the value is empty — no "N/A" noise. */
const field = (label: string, value: unknown, wrap = false): DecoratedText[] => {
  if (value === null || value === undefined) return [];
  const text = String(value).trim();
  if (!text) return [];
  return [{ decoratedText: { ...(label ? { topLabel: label } : {}), text, wrapText: wrap } }];
};

const section = (header: string, widgets: DecoratedText[]) =>
  widgets.length === 0 ? [] : [{ header, collapsible: false, widgets }];

const linkButton = (text: string, url: string) => ({
  text,
  onClick: { openLink: { url } },
});

const card = (cardId: string, header: unknown, sections: unknown[]) => ({
  cardsV2: [{ cardId, card: { header, sections } }],
});

/** Dashboard deep link, or no button at all when ADMIN_BASE_URL is unusable. */
const dashboardButton = (text: string, path: string) => {
  const base = adminBaseUrl();
  return base ? [linkButton(text, `${base}${path}`)] : [];
};

// ---- application --------------------------------------------------------

export const applicationCard = (application: ApplicationWithJob) => {
  const a = application;
  const buttons = [
    ...dashboardButton(
      "Open in dashboard",
      `/admin/dashboard/applications/${a.job_id}?application=${a.id}`
    ),
  ];
  if (a.email) buttons.push(linkButton("Email applicant", `mailto:${a.email}`));

  const sections = [
    ...section("Contact", [
      ...field("Email", a.email),
      ...field("Phone", a.phone_number),
      ...field("Facebook", a.facebook_url),
    ]),
    ...section("Profile", [
      ...field("Date of birth", `${formatDate(a.date_of_birth)} (age ${ageFrom(a.date_of_birth)})`),
      ...field("Gender", a.gender && humanize(a.gender)),
      ...field("Country", a.country),
      ...field("Residence status", a.residence_status && humanize(a.residence_status)),
      ...field("Japanese ability", a.japanese_ability),
    ]),
    ...section("Location & availability", [
      ...field("Current address", a.current_address, true),
      ...field("Permanent address", a.permanent_address, true),
      ...field("Nearest station", a.nearest_station),
      ...field("Preferred location", a.preferred_location),
      ...field("Contract", a.availability && humanize(a.availability)),
      ...field("Working days", formatWorkingDays(a.working_days), true),
    ]),
    ...section("Education & skills", [
      ...field("School / college", a.school_college),
      ...field("Degree", a.degree),
      ...field("Soft skills", a.soft_skills, true),
    ]),
    ...section("Cover letter", field("", truncate(a.cover_letter ?? "", COVER_LETTER_LIMIT), true)),
    ...section("Résumé", field(
      "",
      a.resume_key
        ? "Attached — open the dashboard to download (admin login required)"
        : "No résumé attached"
    )),
    { widgets: [{ buttonList: { buttons } }] },
  ];

  return card(`application-${a.id}`, {
    title: a.full_name,
    subtitle: `Applied for ${a.job.title} · ${formatDateTime(a.created_at)}`,
  }, sections);
};

// ---- inquiries ----------------------------------------------------------

export const candidateInquiryCard = (inquiry: CandidateInquiry) => {
  const i = inquiry;
  const buttons = [
    ...dashboardButton("Open in dashboard", "/admin/dashboard/messages?tab=candidate"),
  ];
  if (i.email) buttons.push(linkButton("Email candidate", `mailto:${i.email}`));

  const sections = [
    ...section("Contact", [
      ...field("Email", i.email),
      ...field("Phone", i.phone_number),
    ]),
    ...section("Profile", [
      ...field("Date of birth", `${formatDate(i.date_of_birth)} (age ${ageFrom(i.date_of_birth)})`),
      ...field("Gender", i.gender && humanize(i.gender)),
      ...field("Current address", i.current_address, true),
      ...field("Preferred location", i.preferred_location),
      ...field("Residence status", i.residence_status && humanize(i.residence_status)),
      ...field("Japanese ability", i.japanese_ability),
    ]),
    ...section("Message", field("", truncate(i.cover_letter ?? "", COVER_LETTER_LIMIT), true)),
    ...section("Résumé", field(
      "",
      i.resume_key
        ? "Attached — open the dashboard to download (admin login required)"
        : "No résumé attached"
    )),
    { widgets: [{ buttonList: { buttons } }] },
  ];

  return card(`candidate-inquiry-${i.id}`, {
    title: i.full_name,
    subtitle: `Open application (no specific vacancy) · ${formatDateTime(i.created_at)}`,
  }, sections);
};

export const companyInquiryCard = (inquiry: ContactRequest) => {
  const i = inquiry;
  const buttons = [
    ...dashboardButton("Open in dashboard", "/admin/dashboard/messages?tab=company"),
  ];
  if (i.email) buttons.push(linkButton("Reply by email", `mailto:${i.email}`));

  const sections = [
    ...section("Contact", [
      ...field("Email", i.email),
      ...field("Phone", i.phone_number),
    ]),
    ...section("Message", [
      ...field("Subject", i.subject, true),
      ...field("Body", truncate(i.message, COVER_LETTER_LIMIT), true),
    ]),
    { widgets: [{ buttonList: { buttons } }] },
  ];

  return card(`company-inquiry-${i.id}`, {
    title: i.name,
    subtitle: `Company inquiry · ${formatDateTime(i.created_at)}`,
  }, sections);
};

// ---- daily digest -------------------------------------------------------

/** Stage order matches the ApplicationStage enum so the card reads as a funnel. */
const STAGE_ORDER = [
  "Pending",
  "ApplicantCalled",
  "InterviewScheduling",
  "Hired",
  "Rejected",
] as const;

/** Drops the whole button row when there are no links worth rendering. */
const digestButtons = () => {
  const buttons = [
    ...dashboardButton("Overview", "/admin/dashboard/overview"),
    ...dashboardButton("Applications", "/admin/dashboard/applications"),
  ];
  return buttons.length === 0 ? [] : [{ widgets: [{ buttonList: { buttons } }] }];
};

export const dailyDigestCard = (digest: DailyDigest) => {
  const pipeline = STAGE_ORDER.map(
    (stage) => `${humanize(stage)}: ${digest.stageCounts[stage] ?? 0}`
  ).join("  ·  ");

  const sections = [
    ...section("Last 24 hours", [
      ...field("New applications", digest.newApplications),
      ...field("New candidate inquiries", digest.newCandidateInquiries),
    ]),
    ...section("Pipeline", field("All stages", pipeline, true)),
    ...section("Awaiting action", [
      ...field("Company inquiries still open", digest.openCompanyInquiries),
    ]),
    ...digestButtons(),
  ];

  return card("daily-digest", {
    title: "Daily recruiting digest",
    subtitle: formatDateTime(new Date()),
  }, sections);
};
