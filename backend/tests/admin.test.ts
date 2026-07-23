import { describe, it, expect } from "vitest";
import request from "supertest";
import { app, createAdminAgent, seedJob, applicationPayload } from "./helpers/harness";

const anon = () => request(app);

describe("admin last-seen", () => {
  it("GET /api/admin/last-seen requires auth", async () => {
    const res = await anon().get("/api/admin/last-seen");
    expect(res.status).toBe(401);
  });

  it("GET /api/admin/last-seen defaults to null for a fresh admin", async () => {
    const admin = await createAdminAgent();
    const res = await admin.agent.get("/api/admin/last-seen");
    expect(res.status).toBe(200);
    expect(res.body.data.lastSeenApplicationsAt).toBeNull();
    expect(res.body.data.lastSeenMessagesAt).toBeNull();
  });

  it("PATCH /api/admin/last-seen rejects an invalid scope (400)", async () => {
    const admin = await createAdminAgent();
    const res = await admin.agent.patch("/api/admin/last-seen").send({ scope: "bogus" });
    expect(res.status).toBe(400);
  });

  it("PATCH /api/admin/last-seen bumps the requested scope to now", async () => {
    const admin = await createAdminAgent();
    const before = Date.now();
    const res = await admin.agent.patch("/api/admin/last-seen").send({ scope: "applications" });
    expect(res.status).toBe(200);
    expect(res.body.data.lastSeenMessagesAt).toBeNull();
    const seenAt = new Date(res.body.data.lastSeenApplicationsAt).getTime();
    expect(seenAt).toBeGreaterThanOrEqual(before);
  });

  it("newApplicationsCount drops to 0 right after marking applications as seen", async () => {
    const admin = await createAdminAgent();
    const jobId = await seedJob(admin);
    await anon().post("/api/applications").send(applicationPayload(jobId));

    const before = await admin.agent.get("/api/applications/stats");
    expect(before.body.data.newApplicationsCount).toBeGreaterThan(0);

    await admin.agent.patch("/api/admin/last-seen").send({ scope: "applications" });

    const after = await admin.agent.get("/api/applications/stats");
    expect(after.body.data.newApplicationsCount).toBe(0);
  });

  it("newMessagesCount drops to 0 right after marking messages as seen", async () => {
    const admin = await createAdminAgent();
    await anon()
      .post("/api/contacts/company-inquiries")
      .send({
        name: "__GPTEST__ stats co",
        email: `stats_${Date.now()}@gptest.local`,
        phone_number: "03-0000-0000",
        subject: "hi",
        message: "hello there",
      });

    const before = await admin.agent.get("/api/contacts/stats");
    expect(before.body.data.newMessagesCount).toBeGreaterThan(0);

    await admin.agent.patch("/api/admin/last-seen").send({ scope: "messages" });

    const after = await admin.agent.get("/api/contacts/stats");
    expect(after.body.data.newMessagesCount).toBe(0);
  });
});
