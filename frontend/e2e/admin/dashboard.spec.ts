import { test, expect } from "@playwright/test";

// These run with the saved admin session (see playwright.config projects).

test("admin dashboard loads when authenticated", async ({ page }) => {
  await page.goto("/admin/dashboard/vacancies");
  await expect(page).toHaveURL(/\/admin\/dashboard\/vacancies/);
  await expect(page).not.toHaveURL(/\/admin\/login/);
});

for (const path of ["vacancies", "applications", "messages"]) {
  test(`dashboard "${path}" page renders for an admin`, async ({ page }) => {
    await page.goto(`/admin/dashboard/${path}`);
    await expect(page).toHaveURL(new RegExp(path));
    await expect(page).not.toHaveURL(/\/admin\/login/);
    // page shell rendered
    await expect(page.locator("body")).toBeVisible();
  });
}

test("logout returns to the login screen", async ({ page }) => {
  await page.goto("/admin/dashboard/vacancies");
  await page.getByRole("button", { name: "Sign out" }).click();
  await page.waitForURL("**/admin/login**", { timeout: 15000 });
  await expect(page).toHaveURL(/\/admin\/login/);
});
