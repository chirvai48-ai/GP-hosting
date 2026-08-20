import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../src/index";
import { prisma } from "../../src/lib/prisma";
import { auth } from "../../src/lib/auth";

export { app, prisma };

// Every row a test creates carries this marker in a text field so cleanupAll can
// find and delete it without touching real data. Admin accounts use the domain.
export const MARKER = "__GPTEST__";
export const TEST_EMAIL_DOMAIN = "gptest.local";

let seq = 0;
const uniq = () => `${Date.now()}_${seq++}_${Math.random().toString(36).slice(2, 7)}`;

export interface AdminSession {
  agent: InstanceType<typeof TestAgent>;
  email: string;
  password: string;
  adminId: string;
}

// Sign-up is gated to already-authenticated admins (or a first-admin bootstrap
// on an empty table). Tests need many admins, so bootstrap one root admin per
// file and have it sign up every subsequent test admin.
const ROOT_EMAIL = `gptest_root@${TEST_EMAIL_DOMAIN}`;
const ROOT_PASSWORD = "RootTest1234!secure";
const ROOT_NAME = `${MARKER} Root Admin`;

let rootAgentPromise: Promise<InstanceType<typeof TestAgent>> | null = null;

function getRootAgent(): Promise<InstanceType<typeof TestAgent>> {
  if (!rootAgentPromise) {
    rootAgentPromise = (async () => {
      const agent = request.agent(app);
      // Sign-up/email is gated to authenticated admins now, so the root test
      // admin is created via the same server-side call the seed script uses
      // (auth.api.signUpEmail) rather than the HTTP route. Fails silently if
      // it already exists (e.g. leftover from a prior run) — sign-in matters.
      try {
        await auth.api.signUpEmail({
          body: { email: ROOT_EMAIL, password: ROOT_PASSWORD, name: ROOT_NAME },
        });
      } catch {
        // already exists
      }
      const signIn = await agent
        .post("/api/auth/sign-in/email")
        .send({ email: ROOT_EMAIL, password: ROOT_PASSWORD });
      if (signIn.status !== 200) {
        throw new Error(`root admin bootstrap failed: ${signIn.status} ${JSON.stringify(signIn.body)}`);
      }
      return agent;
    })();
  }
  return rootAgentPromise;
}

// Sign a fresh admin up (via the root admin) + in via better-auth, returning a
// cookie-bearing agent.
export async function createAdminAgent(): Promise<AdminSession> {
  const agent = request.agent(app);
  const email = `gptest_${uniq()}@${TEST_EMAIL_DOMAIN}`;
  const password = "Test1234!secure";
  const name = `${MARKER} Admin`;

  const root = await getRootAgent();
  await root.post("/api/auth/sign-up/email").send({ email, password, name });
  await agent.post("/api/auth/sign-in/email").send({ email, password });

  const session = await agent.get("/api/auth/get-session");
  const adminId: string = session.body?.user?.id ?? "";
  return { agent, email, password, adminId };
}

// ---- valid payload factories (all tagged with MARKER) --------------------

export function jobPayload(overrides: Record<string, unknown> = {}) {
  return {
    title: `${MARKER} Software Engineer`,
    salary_min: 200000,
    salary_max: 300000,
    currency: "YEN",
    location: "Tokyo",
    experience: 0,
    contract: "Full_time",
    shift_start: "09:00",
    shift_end: "18:00",
    workdays: 5,
    gender: "Any",
    benefits: "Health insurance",
    requirements: "N3+",
    application_method: "Online",
    job_category: "IT",
    languages: ["English", "Japanese"],
    technical_skills: ["TypeScript"],
    soft_skills: "Teamwork",
    status: "Published",
    image_key: `test-key_${uniq()}.jpg`,
    image_type: "image/jpeg",
    ...overrides,
  };
}

export function applicationPayload(
  jobId: number,
  overrides: Record<string, unknown> = {}
) {
  return {
    full_name: `${MARKER} Yamada Taro`,
    date_of_birth: "2000-04-01",
    phone_number: "03-6841-9101",
    email: `applicant_${uniq()}@${TEST_EMAIL_DOMAIN}`,
    gender: "Male",
    country: "Japan",
    nearest_station: "Ikebukuro",
    residence_status: "Work_Visa",
    japanese_ability: "N3",
    working_days: ["Monday", "Wednesday", "Friday"],
    current_address: "Tokyo, Toshima",
    permanent_address: "Osaka",
    preferred_location: "Tokyo",
    availability: "Full_time",
    school_college: "Tokyo University",
    degree: "CS",
    soft_skills: "Communication",
    resume_key: `resume_${uniq()}.pdf`,
    resume_type: "application/pdf",
    job_id: jobId,
    ...overrides,
  };
}

export function companyInquiryPayload(overrides: Record<string, unknown> = {}) {
  return {
    name: `${MARKER} Acme Corp`,
    email: `company_${uniq()}@${TEST_EMAIL_DOMAIN}`,
    phone_number: "03-0000-0000",
    subject: "Hiring inquiry",
    message: "We want to hire foreign talent.",
    ...overrides,
  };
}

export function candidateInquiryPayload(overrides: Record<string, unknown> = {}) {
  return {
    full_name: `${MARKER} Candidate`,
    email: `cand_${uniq()}@${TEST_EMAIL_DOMAIN}`,
    phone_number: "070-0000-0000",
    date_of_birth: "1998-05-20",
    gender: "Female",
    current_address: "Yokohama",
    preferred_location: "Tokyo",
    residence_status: "Student_Visa",
    japanese_ability: "N2",
    resume_key: `cand_resume_${uniq()}.pdf`,
    resume_type: "application/pdf",
    ...overrides,
  };
}

export function newsPayload(overrides: Record<string, unknown> = {}) {
  return {
    title: `${MARKER} Company milestone announcement`,
    body: "This is a sufficiently long news body for validation purposes.",
    summary: "A short summary here.",
    status: "published",
    ...overrides,
  };
}

// Helper: create a job through the API and return its id.
export async function seedJob(admin: AdminSession): Promise<number> {
  const res = await admin.agent.post("/api/jobs").send(jobPayload());
  if (![200, 201].includes(res.status))
    throw new Error(`seedJob failed: ${res.status} ${JSON.stringify(res.body)}`);
  return res.body.data?.id ?? res.body.id;
}

// Helper: extract a row array from any list response, paginated or legacy.
export function listItems<T = any>(body: any): T[] {
  return body?.data?.items ?? body?.data ?? [];
}

// ---- cleanup -------------------------------------------------------------

export async function cleanupAll() {
  // Order respects FKs: notes -> applications -> jobs; inquiries; news; admins.
  await prisma.note.deleteMany({ where: { text: { contains: MARKER } } }).catch(() => {});
  await prisma.application.deleteMany({ where: { full_name: { contains: MARKER } } }).catch(() => {});
  await prisma.job.deleteMany({ where: { title: { contains: MARKER } } }).catch(() => {});
  await prisma.contactRequest.deleteMany({ where: { name: { contains: MARKER } } }).catch(() => {});
  await prisma.candidateInquiry.deleteMany({ where: { full_name: { contains: MARKER } } }).catch(() => {});
  await prisma.news.deleteMany({ where: { title: { contains: MARKER } } }).catch(() => {});
  // Admin cascade removes sessions + accounts.
  await prisma.admin.deleteMany({ where: { email: { contains: TEST_EMAIL_DOMAIN } } }).catch(() => {});
}
