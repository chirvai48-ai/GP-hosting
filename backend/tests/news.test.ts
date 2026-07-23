import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app, createAdminAgent, newsPayload, MARKER, type AdminSession } from "./helpers/harness";

const anon = () => request(app);

describe("news (blogs)", () => {
  let admin: AdminSession;
  beforeAll(async () => {
    admin = await createAdminAgent();
  });

  it("GET /api/news is public", async () => {
    const res = await anon().get("/api/news");
    expect(res.status).toBe(200);
  });

  it("admin creates a valid news post", async () => {
    const res = await admin.agent
      .post("/api/news")
      .send(newsPayload({ admin_id: admin.adminId }));
    expect([200, 201], JSON.stringify(res.body)).toContain(res.status);
  });

  it("rejects a too-short title (400)", async () => {
    const res = await admin.agent
      .post("/api/news")
      .send(newsPayload({ title: "Hi", admin_id: admin.adminId }));
    expect(res.status).toBe(400);
  });

  it("rejects a too-short body (400)", async () => {
    const res = await admin.agent
      .post("/api/news")
      .send(newsPayload({ body: "short", admin_id: admin.adminId }));
    expect(res.status).toBe(400);
  });

  it("admin updates then deletes a news post", async () => {
    const created = await admin.agent
      .post("/api/news")
      .send(newsPayload({ admin_id: admin.adminId }));
    const id = created.body.data?.id ?? created.body.id;
    expect(id).toBeTruthy();

    const upd = await admin.agent
      .patch(`/api/news/${id}`)
      .send({ title: `${MARKER} Updated news title` });
    expect([200, 204]).toContain(upd.status);

    const del = await admin.agent.delete(`/api/news/${id}`);
    expect([200, 204]).toContain(del.status);
  });
});
