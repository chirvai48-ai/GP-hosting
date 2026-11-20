import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { notify } from "../src/lib/notifier";
import type { ApplicationWithJob } from "../src/lib/notifier";

// Pure unit tests: no harness, no database. The card builders and the transport
// are exercised entirely against a stubbed fetch, so this file runs offline.
const WEBHOOK = "https://chat.googleapis.com/v1/spaces/TEST/messages?key=k&token=t";

// A fully-populated application, so the card builder is exercised on every
// branch rather than only the required fields.
const fakeApplication = (overrides: Partial<ApplicationWithJob> = {}): ApplicationWithJob =>
  ({
    id: 4242,
    full_name: "Test Applicant",
    date_of_birth: new Date("1995-06-15"),
    phone_number: "090-1234-5678",
    email: "applicant@example.com",
    current_address: "Shibuya, Tokyo",
    permanent_address: "Kathmandu, Nepal",
    preferred_location: "Tokyo",
    availability: "Full_time",
    school_college: "Example University",
    degree: "BSc Computer Science",
    soft_skills: "Teamwork, communication",
    job_id: 7,
    stage: "Pending",
    status: "Active",
    created_at: new Date("2026-11-17T09:30:00Z"),
    updated_at: new Date("2026-11-17T09:30:00Z"),
    cover_letter: "I would like to apply.",
    resume_key: "abc.pdf",
    resume_type: "application/pdf",
    gender: "Female",
    facebook_url: "https://facebook.com/test",
    country: "Nepal",
    nearest_station: "Shibuya",
    residence_status: "Work_Visa",
    japanese_ability: "N3",
    working_days: ["Monday", "Tuesday"],
    starred: false,
    cv_creation_status: "Pending",
    job: { id: 7, title: "Backend Engineer" },
    ...overrides,
  }) as ApplicationWithJob;

const okResponse = () => new Response("", { status: 200 });

describe("google chat notifier", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    process.env.GOOGLE_CHAT_WEBHOOK_APPLICATIONS = WEBHOOK;
    process.env.ADMIN_BASE_URL = "https://admin.example.com";
    delete process.env.NOTIFY_ENABLED;
    fetchMock = vi.fn(async () => okResponse());
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    delete process.env.GOOGLE_CHAT_WEBHOOK_APPLICATIONS;
    delete process.env.ADMIN_BASE_URL;
  });

  it("posts a card to the configured webhook", async () => {
    const result = await notify({ type: "application.created", application: fakeApplication() });

    expect(result.delivered).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(WEBHOOK);
    expect(init.method).toBe("POST");
  });

  it("includes every submitted field and a dashboard deep link", async () => {
    await notify({ type: "application.created", application: fakeApplication() });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = String(init.body);

    for (const expected of [
      "Test Applicant",
      "Backend Engineer",
      "applicant@example.com",
      "090-1234-5678",
      "Shibuya, Tokyo",
      "Kathmandu, Nepal",
      "Example University",
      "BSc Computer Science",
      "Teamwork, communication",
      "Work Visa", // enum underscores humanized
      "N3",
      "Monday, Tuesday",
      "I would like to apply.",
    ]) {
      expect(body, `missing ${expected}`).toContain(expected);
    }

    expect(body).toContain(
      "https://admin.example.com/admin/dashboard/applications/7?application=4242"
    );
  });

  it("omits the dashboard button when ADMIN_BASE_URL is unset, keeping the card valid", async () => {
    // Chat rejects a relative openLink.url with a 400, which would lose the
    // whole notification — so a missing env var must drop only the button.
    delete process.env.ADMIN_BASE_URL;

    await notify({ type: "application.created", application: fakeApplication() });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = String(init.body);
    expect(body).not.toContain("Open in dashboard");
    expect(body).not.toContain('"url":"/admin');
    // The applicant's data still arrives in full, which is the point.
    expect(body).toContain("Test Applicant");
    expect(body).toContain("applicant@example.com");
    // mailto: buttons don't depend on the dashboard origin.
    expect(body).toContain("mailto:applicant@example.com");
  });

  it("ignores a non-http ADMIN_BASE_URL rather than emitting a bad link", async () => {
    process.env.ADMIN_BASE_URL = "not a url";

    await notify({ type: "application.created", application: fakeApplication() });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(String(init.body)).not.toContain("Open in dashboard");
  });

  it("strips a trailing slash from ADMIN_BASE_URL", async () => {
    process.env.ADMIN_BASE_URL = "https://admin.example.com/";

    await notify({ type: "application.created", application: fakeApplication() });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(String(init.body)).toContain(
      "https://admin.example.com/admin/dashboard/applications/7?application=4242"
    );
  });

  it("omits fields the applicant left blank instead of printing placeholders", async () => {
    await notify({
      type: "application.created",
      application: fakeApplication({ facebook_url: null, permanent_address: null }),
    });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = String(init.body);
    expect(body).not.toContain("Facebook");
    expect(body).not.toContain("Permanent address");
  });

  it("truncates a very long cover letter to stay under Chat's size cap", async () => {
    await notify({
      type: "application.created",
      application: fakeApplication({ cover_letter: "あ".repeat(20_000) }),
    });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(Buffer.byteLength(String(init.body), "utf8")).toBeLessThan(28_000);
    expect(String(init.body)).toContain("truncated");
  });

  it("retries once on a 429 and then succeeds", async () => {
    fetchMock
      .mockImplementationOnce(async () => new Response("rate limited", { status: 429 }))
      .mockImplementationOnce(async () => okResponse());

    const result = await notify({ type: "application.created", application: fakeApplication() });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.delivered).toBe(true);
  });

  it("does not retry a 400 — a malformed card is our bug, not a transient fault", async () => {
    fetchMock.mockImplementation(async () => new Response("bad request", { status: 400 }));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await notify({ type: "application.created", application: fakeApplication() });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.delivered).toBe(false);
    expect(result.reason).toBe("http-error");
  });

  it("is a no-op when no webhook is configured", async () => {
    delete process.env.GOOGLE_CHAT_WEBHOOK_APPLICATIONS;
    vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await notify({ type: "application.created", application: fakeApplication() });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.reason).toBe("unconfigured");
  });

  it("is a no-op when NOTIFY_ENABLED=false", async () => {
    process.env.NOTIFY_ENABLED = "false";

    const result = await notify({ type: "application.created", application: fakeApplication() });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.reason).toBe("disabled");
    delete process.env.NOTIFY_ENABLED;
  });
});
