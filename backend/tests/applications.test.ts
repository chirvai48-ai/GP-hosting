import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import {
  app,
  createAdminAgent,
  seedJob,
  applicationPayload,
  MARKER,
  type AdminSession,
} from "./helpers/harness";

const anon = () => request(app);

describe("application form submission (public)", () => {
  let admin: AdminSession;
  let jobId: number;
  beforeAll(async () => {
    admin = await createAdminAgent();
    jobId = await seedJob(admin);
  });

  it("accepts a valid application and persists it", async () => {
    const payload = applicationPayload(jobId);
    const res = await anon().post("/api/applications").send(payload);
    expect([200, 201], JSON.stringify(res.body)).toContain(res.status);

    const list = await admin.agent.get("/api/applications");
    const rows: any[] = list.body.data ?? list.body;
    expect(rows.some((a) => a.email === payload.email)).toBe(true);
  });

  it("rejects an application missing required fields (400)", async () => {
    const bad = applicationPayload(jobId) as any;
    delete bad.email;
    const res = await anon().post("/api/applications").send(bad);
    expect(res.status).toBe(400);
  });

  it("rejects a bad email (400)", async () => {
    const res = await anon()
      .post("/api/applications")
      .send(applicationPayload(jobId, { email: "not-an-email" }));
    expect(res.status).toBe(400);
  });

  it("rejects an invalid enum value (400)", async () => {
    const res = await anon()
      .post("/api/applications")
      .send(applicationPayload(jobId, { gender: "Alien" }));
    expect(res.status).toBe(400);
  });
});

describe("application admin lifecycle", () => {
  let admin: AdminSession;
  let jobId: number;
  let appId: number;

  beforeAll(async () => {
    admin = await createAdminAgent();
    jobId = await seedJob(admin);
    const created = await anon()
      .post("/api/applications")
      .send(applicationPayload(jobId));
    appId = created.body.data?.id;
    expect(appId, JSON.stringify(created.body)).toBeTruthy();
  });

  it("GET /api/applications/:id returns the application", async () => {
    const res = await admin.agent.get(`/api/applications/${appId}`);
    expect(res.status).toBe(200);
  });

  it("PATCH updates stage + status", async () => {
    const res = await admin.agent
      .patch(`/api/applications/${appId}`)
      .send({ stage: "ApplicantCalled", status: "OnHold" });
    expect([200, 204]).toContain(res.status);

    const after = await admin.agent.get(`/api/applications/${appId}`);
    const row = after.body.data ?? after.body;
    expect(row.stage).toBe("ApplicantCalled");
    expect(row.status).toBe("OnHold");
  });

  it("moving to TalentPool shows it in the talent pool", async () => {
    await admin.agent.patch(`/api/applications/${appId}`).send({ status: "TalentPool" });
    const pool = await admin.agent.get("/api/applications/talent-pool");
    const rows: any[] = pool.body.data ?? pool.body;
    expect(rows.some((a) => a.id === appId)).toBe(true);
  });

  it("exports the resume as xlsx", async () => {
    const res = await admin.agent
      .get(`/api/applications/${appId}/resume.xlsx`)
      .buffer(true)
      .parse((r, cb) => {
        const chunks: Buffer[] = [];
        r.on("data", (c: Buffer) => chunks.push(c));
        r.on("end", () => cb(null, Buffer.concat(chunks)));
      });
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("spreadsheetml.sheet");
    expect(res.body.length).toBeGreaterThan(1000);
    // xlsx is a zip — must start with the PK signature
    expect(res.body.slice(0, 2).toString()).toBe("PK");
  });

  it("notes: create, list, edit, delete", async () => {
    const create = await admin.agent
      .post(`/api/applications/${appId}/notes`)
      .send({ text: `${MARKER} first note`, created_by_admin_id: admin.adminId });
    expect([200, 201], JSON.stringify(create.body)).toContain(create.status);

    const list = await admin.agent.get(`/api/applications/${appId}/notes`);
    const notes: any[] = list.body.data ?? list.body;
    expect(notes.length).toBeGreaterThan(0);
    const noteId = notes[0].id;

    const edit = await admin.agent
      .patch(`/api/notes/${noteId}`)
      .send({ text: `${MARKER} edited note`, last_edited_by_admin_id: admin.adminId });
    expect([200, 204]).toContain(edit.status);

    const del = await admin.agent.delete(`/api/notes/${noteId}`);
    expect([200, 204]).toContain(del.status);
  });

  it("DELETE removes the application", async () => {
    const res = await admin.agent.delete(`/api/applications/${appId}`);
    expect([200, 204]).toContain(res.status);
    // getById returns 200 with data:null for a missing row (existing API behavior)
    const after = await admin.agent.get(`/api/applications/${appId}`);
    expect(after.body.data).toBeFalsy();
  });

  it("GET /api/applications/stats requires auth", async () => {
    const res = await anon().get("/api/applications/stats");
    expect(res.status).toBe(401);
  });

  it("GET /api/applications/stats returns aggregate counts for admin", async () => {
    const res = await admin.agent.get("/api/applications/stats");
    expect(res.status).toBe(200);
    const data = res.body.data;
    expect(data).toHaveProperty("stageCounts");
    expect(data).toHaveProperty("talentPoolCount");
    expect(data).toHaveProperty("hiredThisMonth");
    expect(data).toHaveProperty("totalApplications");
  });

  it("GET /api/applications/trend requires auth", async () => {
    const res = await anon().get("/api/applications/trend?granularity=monthly&year=2026&month=8");
    expect(res.status).toBe(401);
  });

  it("GET /api/applications/trend rejects an invalid granularity", async () => {
    const res = await admin.agent.get("/api/applications/trend?granularity=daily");
    expect(res.status).toBe(400);
  });

  it("GET /api/applications/trend rejects monthly without a month", async () => {
    const res = await admin.agent.get("/api/applications/trend?granularity=monthly&year=2026");
    expect(res.status).toBe(400);
  });

  it("GET /api/applications/trend rejects quarterly without a quarter", async () => {
    const res = await admin.agent.get("/api/applications/trend?granularity=quarterly&year=2026");
    expect(res.status).toBe(400);
  });

  it("GET /api/applications/trend returns a day-per-bucket monthly trend", async () => {
    const res = await admin.agent.get("/api/applications/trend?granularity=monthly&year=2026&month=2");
    expect(res.status).toBe(200);
    const data = res.body.data;
    expect(data.granularity).toBe("monthly");
    // Feb 2026 is not a leap year (2026 % 4 !== 0) -> 28 days
    expect(data.trend).toHaveLength(28);
    expect(data.trend[0]).toHaveProperty("label");
    expect(data.trend[0]).toHaveProperty("count");
  });

  it("GET /api/applications/trend returns a week-per-bucket quarterly trend covering the quarter", async () => {
    const res = await admin.agent.get("/api/applications/trend?granularity=quarterly&year=2026&quarter=1");
    expect(res.status).toBe(200);
    const data = res.body.data;
    expect(data.granularity).toBe("quarterly");
    expect(data.trend.length).toBeGreaterThanOrEqual(13);
    expect(data.trend.length).toBeLessThanOrEqual(15);
  });

  it("GET /api/applications/trend returns a 12-bucket yearly trend", async () => {
    const res = await admin.agent.get("/api/applications/trend?granularity=yearly&year=2026");
    expect(res.status).toBe(200);
    const data = res.body.data;
    expect(data.granularity).toBe("yearly");
    expect(data.trend).toHaveLength(12);
  });

  it("GET /api/applications/trend counts applications created earlier in this test file under the current month", async () => {
    // Applications created by earlier tests in this describe block default created_at to now.
    const now = new Date();
    const res = await admin.agent.get(
      `/api/applications/trend?granularity=monthly&year=${now.getUTCFullYear()}&month=${now.getUTCMonth() + 1}`
    );
    expect(res.status).toBe(200);
    const total = res.body.data.trend.reduce((sum: number, b: { count: number }) => sum + b.count, 0);
    expect(total).toBeGreaterThan(0);
  });
});
