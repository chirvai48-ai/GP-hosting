import { vi, afterAll } from "vitest";

// R2/Cloudflare must never be hit in tests: getUrl/putUrl only sign locally but
// deleteObject makes a real network call, and the config throws without creds.
// Stub the whole module so every code path is deterministic and offline.
vi.mock("../src/configs/cloudflare", () => ({
  getUrl: vi.fn(async () => "https://test.local/signed-get"),
  putUrl: vi.fn(async () => "https://test.local/signed-put"),
  deleteObject: vi.fn(async () => undefined),
}));

// Sweep every test-created row (all tagged with MARKER) after each test file.
afterAll(async () => {
  const { cleanupAll } = await import("./helpers/harness");
  await cleanupAll();
});
