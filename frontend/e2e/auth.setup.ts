import { test as setup, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { API_URL, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } from "./constants";

const authFile = "e2e/.auth/admin.json";

// Create a known admin (idempotent) and log in through the real UI, then persist
// the session so the admin project reuses it.
setup("create admin + authenticate", async ({ page, request }) => {
  await request
    .post(`${API_URL}/api/auth/sign-up/email`, {
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: ADMIN_NAME },
    })
    .catch(() => {}); // ignore "already exists"

  await page.goto("/admin/login");
  await page.getByPlaceholder("admin@example.com").fill(ADMIN_EMAIL);
  await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();

  await page.waitForURL("**/admin/dashboard/**", { timeout: 20000 });

  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
  expect(fs.existsSync(authFile)).toBe(true);
});
