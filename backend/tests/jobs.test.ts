import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app, createAdminAgent, jobPayload, MARKER, type AdminSession } from "./helpers/harness";

const anon = () => request(app);

describe("jobs (vacancies)", () => {
  let admin: AdminSession;
  beforeAll(async () => {
    admin = await createAdminAgent();
  });

  it("GET /api/jobs is public and returns a list", async () => {
    const res = await anon().get("/api/jobs");
    expect(res.status).toBe(200);
  });

  it("admin creates a valid job", async () => {
    const res = await admin.agent.post("/api/jobs").send(jobPayload());
    expect(res.status).toBe(201);
    const id = res.body.data?.id;
    expect(id).toBeTruthy();

    const fetched = await anon().get(`/api/jobs/${id}`);
    expect(fetched.status).toBe(200);
  });

  it("rejects salary_max < salary_min (400)", async () => {
    const res = await admin.agent
      .post("/api/jobs")
      .send(jobPayload({ salary_min: 500000, salary_max: 100000 }));
    expect(res.status).toBe(400);
  });

  it("rejects missing required field (400)", async () => {
    const bad = jobPayload() as any;
    delete bad.location;
    const res = await admin.agent.post("/api/jobs").send(bad);
    expect(res.status).toBe(400);
  });

  it("rejects an invalid contract enum (400)", async () => {
    const res = await admin.agent
      .post("/api/jobs")
      .send(jobPayload({ contract: "Casual" }));
    expect(res.status).toBe(400);
  });

  it("admin updates a job", async () => {
    const created = await admin.agent.post("/api/jobs").send(jobPayload());
    const id = created.body.data?.id;
    const res = await admin.agent
      .patch(`/api/jobs/${id}`)
      .send({ title: `${MARKER} Updated Title` });
    expect([200, 204]).toContain(res.status);

    const fetched = await anon().get(`/api/jobs/${id}`);
    // getJobsById uses findMany, so data is an array
    const data = fetched.body.data ?? fetched.body;
    const job = Array.isArray(data) ? data[0] : data;
    expect(job.title).toBe(`${MARKER} Updated Title`);
  });

  it("admin deletes a job", async () => {
    const created = await admin.agent.post("/api/jobs").send(jobPayload());
    const id = created.body.data?.id;
    const res = await admin.agent.delete(`/api/jobs/${id}`);
    expect([200, 204]).toContain(res.status);
  });

  it("GET /api/jobs/stats requires auth", async () => {
    const res = await anon().get("/api/jobs/stats");
    expect(res.status).toBe(401);
  });

  it("GET /api/jobs/stats returns status counts for admin", async () => {
    await admin.agent.post("/api/jobs").send(jobPayload());
    const res = await admin.agent.get("/api/jobs/stats");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("statusCounts");
    expect(res.body.data).toHaveProperty("totalJobs");
    expect(typeof res.body.data.totalJobs).toBe("number");
  });
});
