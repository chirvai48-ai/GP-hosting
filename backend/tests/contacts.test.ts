import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import {
  app,
  createAdminAgent,
  companyInquiryPayload,
  candidateInquiryPayload,
  type AdminSession,
} from "./helpers/harness";

const anon = () => request(app);

describe("company inquiry form", () => {
  let admin: AdminSession;
  beforeAll(async () => {
    admin = await createAdminAgent();
  });

  it("accepts a valid company inquiry (public)", async () => {
    const payload = companyInquiryPayload();
    const res = await anon().post("/api/contacts/company-inquiries").send(payload);
    expect([200, 201], JSON.stringify(res.body)).toContain(res.status);

    const list = await admin.agent.get("/api/contacts/company-inquiries");
    const rows: any[] = list.body.data ?? list.body;
    expect(rows.some((r) => r.email === payload.email)).toBe(true);
  });

  it("rejects a company inquiry missing subject (400)", async () => {
    const bad = companyInquiryPayload() as any;
    delete bad.subject;
    const res = await anon().post("/api/contacts/company-inquiries").send(bad);
    expect(res.status).toBe(400);
  });

  it("admin can view, update status, and delete an inquiry", async () => {
    const payload = companyInquiryPayload();
    await anon().post("/api/contacts/company-inquiries").send(payload);
    const list = await admin.agent.get("/api/contacts/company-inquiries");
    const rows: any[] = list.body.data ?? list.body;
    const id = rows.find((r) => r.email === payload.email)?.id;
    expect(id).toBeTruthy();

    const byId = await admin.agent.get(`/api/contacts/company-inquiries/${id}`);
    expect(byId.status).toBe(200);

    const patch = await admin.agent
      .patch(`/api/contacts/company-inquiries/${id}`)
      .send({ status: "Resolved" });
    expect([200, 204]).toContain(patch.status);

    const del = await admin.agent.delete(`/api/contacts/company-inquiries/${id}`);
    expect([200, 204]).toContain(del.status);
  });
});

describe("candidate inquiry form", () => {
  let admin: AdminSession;
  beforeAll(async () => {
    admin = await createAdminAgent();
  });

  it("accepts a valid candidate inquiry (public)", async () => {
    const payload = candidateInquiryPayload();
    const res = await anon().post("/api/contacts/candidate-inquiries").send(payload);
    expect([200, 201], JSON.stringify(res.body)).toContain(res.status);
  });

  it("rejects a candidate inquiry with a bad email (400)", async () => {
    const res = await anon()
      .post("/api/contacts/candidate-inquiries")
      .send(candidateInquiryPayload({ email: "nope" }));
    expect(res.status).toBe(400);
  });

  it("rejects a candidate inquiry missing resume_key (400)", async () => {
    const bad = candidateInquiryPayload() as any;
    delete bad.resume_key;
    const res = await anon().post("/api/contacts/candidate-inquiries").send(bad);
    expect(res.status).toBe(400);
  });

  it("admin can list, update state, and delete", async () => {
    const payload = candidateInquiryPayload();
    await anon().post("/api/contacts/candidate-inquiries").send(payload);
    const list = await admin.agent.get("/api/contacts/candidate-inquiries");
    const rows: any[] = list.body.data ?? list.body;
    const id = rows.find((r) => r.email === payload.email)?.id;
    expect(id).toBeTruthy();

    const patch = await admin.agent
      .patch(`/api/contacts/candidate-inquiries/${id}`)
      .send({ state: "MovedToTalentPool" });
    expect([200, 204]).toContain(patch.status);

    const del = await admin.agent.delete(`/api/contacts/candidate-inquiries/${id}`);
    expect([200, 204]).toContain(del.status);
  });
});

describe("contact stats", () => {
  let admin: AdminSession;
  beforeAll(async () => {
    admin = await createAdminAgent();
  });

  it("GET /api/contacts/stats requires auth", async () => {
    const res = await anon().get("/api/contacts/stats");
    expect(res.status).toBe(401);
  });

  it("GET /api/contacts/stats returns counts for admin", async () => {
    const res = await admin.agent.get("/api/contacts/stats");
    expect(res.status).toBe(200);
    const data = res.body.data;
    expect(data).toHaveProperty("openContactRequests");
    expect(data).toHaveProperty("newCandidateInquiries");
    expect(data).toHaveProperty("movedToTalentPool");
  });
});
