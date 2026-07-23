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
});
