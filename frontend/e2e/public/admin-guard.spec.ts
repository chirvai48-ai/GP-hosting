import { test, expect } from "@playwright/test";

// No saved session in the "public" project → the AuthGuard must bounce us.
test("unauthenticated admin route redirects to login", async ({ page }) => {
  await page.goto("/admin/dashboard/vacancies");
  await page.waitForURL("**/admin/login**", { timeout: 15000 });
  await expect(page).toHaveURL(/\/admin\/login/);
});
