import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app, createAdminAgent, jobPayload, listItems, MARKER, type AdminSession } from "./helpers/harness";

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

  it("GET /api/jobs?status=Published only returns published jobs", async () => {
    const draft = await admin.agent.post("/api/jobs").send(jobPayload({ status: "Draft" }));
    const published = await admin.agent.post("/api/jobs").send(jobPayload({ status: "Published" }));

    const res = await anon().get("/api/jobs?status=Published");
    expect(res.status).toBe(200);
    const ids = listItems(res.body).map((j: any) => j.id);
    expect(ids).toContain(published.body.data.id);
    expect(ids).not.toContain(draft.body.data.id);
  });

  it("GET /api/jobs with no status param still returns all statuses", async () => {
    const draft = await admin.agent.post("/api/jobs").send(jobPayload({ status: "Draft" }));
    const res = await anon().get("/api/jobs");
    const ids = listItems(res.body).map((j: any) => j.id);
    expect(ids).toContain(draft.body.data.id);
  });

  it("GET /api/jobs?status=garbage returns 400, not a 500", async () => {
    const res = await anon().get("/api/jobs?status=garbage");
    expect(res.status).toBe(400);
  });

  it("GET /api/jobs is paginated (items/total/page)", async () => {
    const res = await anon().get("/api/jobs?page=1&limit=2");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.items)).toBe(true);
    expect(res.body.data.items.length).toBeLessThanOrEqual(2);
    expect(typeof res.body.data.total).toBe("number");
    expect(res.body.data.page).toBe(1);
    expect(res.body.data.limit).toBe(2);
    expect(typeof res.body.data.totalPages).toBe("number");
    expect(typeof res.body.data.hasNext).toBe("boolean");
  });

  it("GET /api/jobs?limit=1 paginates to distinct rows across pages", async () => {
    const first = await anon().get("/api/jobs?page=1&limit=1");
    const second = await anon().get("/api/jobs?page=2&limit=1");
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    const firstIds = listItems(first.body).map((j: any) => j.id);
    const secondIds = listItems(second.body).map((j: any) => j.id);
    expect(firstIds).not.toEqual(secondIds);
  });

  const TOKEN = `zorbotronz_${Date.now()}`;

  it("GET /api/jobs?keyword= filters by title (server-side)", async () => {
    const cat = await admin.agent.post("/api/jobs")
      .send(jobPayload({ title: `${MARKER} ${TOKEN} Platform` }));
    expect(cat.status).toBe(201);

    const res = await anon().get(`/api/jobs?status=Published&keyword=${TOKEN}`);
    expect(res.status).toBe(200);
    const ids = listItems(res.body).map((j: any) => j.id);
    expect(ids).toContain(cat.body.data.id);

    const none = await anon().get("/api/jobs?status=Published&keyword=nomatch_zzz_99999");
    expect(listItems(none.body)).toHaveLength(0);
  });

  it("GET /api/jobs?exp=6 includes experience >= 5", async () => {
    const senior = await admin.agent.post("/api/jobs")
      .send(jobPayload({ title: `${MARKER} ${TOKEN} Senior`, experience: 8 }));
    expect(senior.status).toBe(201);

    const res = await anon().get("/api/jobs?status=Published&exp=6");
    const ids = listItems(res.body).map((j: any) => j.id);
    expect(ids).toContain(senior.body.data.id);
  });

  it("GET /api/jobs?salary_min&salary_max filters by overlap", async () => {
    const job = await admin.agent.post("/api/jobs")
      .send(jobPayload({ title: `${MARKER} ${TOKEN} Salary`, salary_min: 200000, salary_max: 300000 }));
    expect(job.status).toBe(201);

    const res = await anon().get("/api/jobs?status=Published&salary_min=250&salary_max=1000");
    const ids = listItems(res.body).map((j: any) => j.id);
    expect(ids).toContain(job.body.data.id);
  });

  it("GET /api/jobs?schedule=part_time only returns matching contracts", async () => {
    const pt = await admin.agent.post("/api/jobs")
      .send(jobPayload({ title: `${MARKER} ${TOKEN} PT`, contract: "Part_time" }));
    const ft = await admin.agent.post("/api/jobs")
      .send(jobPayload({ title: `${MARKER} ${TOKEN} FT`, contract: "Full_time" }));
    expect(pt.status).toBe(201);
    expect(ft.status).toBe(201);

    const res = await anon().get("/api/jobs?status=Published&schedule=part_time");
    const ids = listItems(res.body).map((j: any) => j.id);
    expect(ids).toContain(pt.body.data.id);
    expect(ids).not.toContain(ft.body.data.id);
  });
});
