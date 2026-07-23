import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app, createAdminAgent, seedJob, applicationPayload, type AdminSession } from "./helpers/harness";

// Unauthenticated client (no session cookie).
const anon = () => request(app);

describe("public endpoints (no auth required)", () => {
  it("GET /api/jobs is public", async () => {
    const res = await anon().get("/api/jobs");
    expect(res.status).toBe(200);
  });

  it("GET /api/news is public", async () => {
    const res = await anon().get("/api/news");
    expect(res.status).toBe(200);
  });

  it("POST /api/applications (public apply) works without auth", async () => {
    const admin = await createAdminAgent();
    const jobId = await seedJob(admin);
    const res = await anon().post("/api/applications").send(applicationPayload(jobId));
    expect([200, 201], JSON.stringify(res.body)).toContain(res.status);
  });

  it("POST /api/contacts/company-inquiries is public", async () => {
    const res = await anon()
      .post("/api/contacts/company-inquiries")
      .send({
        name: "__GPTEST__ anon co",
        email: "anon@gptest.local",
        phone_number: "03-0000-0000",
        subject: "hi",
        message: "hello there",
      });
    expect([200, 201]).toContain(res.status);
  });
});

describe("admin endpoints reject unauthenticated requests (401)", () => {
  let jobId: number;
  let admin: AdminSession;

  beforeAll(async () => {
    admin = await createAdminAgent();
    jobId = await seedJob(admin);
  });

  const cases: Array<[string, () => request.Test]> = [
    ["POST /api/jobs", () => anon().post("/api/jobs").send({})],
    ["PATCH /api/jobs/:id", () => anon().patch(`/api/jobs/1`).send({})],
    ["DELETE /api/jobs/:id", () => anon().delete(`/api/jobs/1`)],
    ["GET /api/applications", () => anon().get("/api/applications")],
    ["GET /api/applications/talent-pool", () => anon().get("/api/applications/talent-pool")],
    ["GET /api/applications/:id", () => anon().get("/api/applications/1")],
    ["GET /api/applications/:id/resume.xlsx", () => anon().get("/api/applications/1/resume.xlsx")],
    ["PATCH /api/applications/:id", () => anon().patch("/api/applications/1").send({})],
    ["DELETE /api/applications/:id", () => anon().delete("/api/applications/1")],
    ["POST /api/news", () => anon().post("/api/news").send({})],
    ["PATCH /api/news/:id", () => anon().patch("/api/news/1").send({})],
    ["DELETE /api/news/:id", () => anon().delete("/api/news/1")],
    ["GET /api/applications/1/notes", () => anon().get("/api/applications/1/notes")],
    ["POST /api/applications/1/notes", () => anon().post("/api/applications/1/notes").send({})],
    ["PATCH /api/notes/:id", () => anon().patch("/api/notes/1").send({})],
    ["DELETE /api/notes/:id", () => anon().delete("/api/notes/1")],
    ["GET /api/contacts/company-inquiries", () => anon().get("/api/contacts/company-inquiries")],
    ["PATCH /api/contacts/company-inquiries/:id", () => anon().patch("/api/contacts/company-inquiries/1").send({})],
    ["DELETE /api/contacts/company-inquiries/:id", () => anon().delete("/api/contacts/company-inquiries/1")],
    ["GET /api/contacts/candidate-inquiries", () => anon().get("/api/contacts/candidate-inquiries")],
    ["PATCH /api/contacts/candidate-inquiries/:id", () => anon().patch("/api/contacts/candidate-inquiries/1").send({})],
    ["DELETE /api/contacts/candidate-inquiries/:id", () => anon().delete("/api/contacts/candidate-inquiries/1")],
  ];

  it.each(cases)("%s -> 401", async (_label, call) => {
    const res = await call();
    expect(res.status).toBe(401);
  });
});

describe("authenticated admin can reach gated endpoints", () => {
  it("GET /api/applications returns 200 with a session", async () => {
    const admin = await createAdminAgent();
    const res = await admin.agent.get("/api/applications");
    expect(res.status).toBe(200);
  });
});
