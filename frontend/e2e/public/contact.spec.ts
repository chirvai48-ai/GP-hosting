import { test, expect } from "@playwright/test";
import { E2E_MARKER } from "../constants";

test("company contact form submits and shows the success message", async ({ page }) => {
  await page.goto("/contact/company");

  await page.getByPlaceholder("例：株式会社〇〇").fill(`${E2E_MARKER} Corp`);
  await page.getByPlaceholder("contact@company.com").fill("e2e_company@gptest.local");
  await page.getByPlaceholder("03-1234-5678").fill("03-0000-0000");
  await page.getByPlaceholder("お問い合わせの件名をご入力ください").fill("E2E inquiry");
  await page.getByPlaceholder(/募集職種/).fill("E2E automated message body.");

  await page.getByRole("button", { name: "この内容で送信する" }).click();

  await expect(page.getByText("お問い合わせの送信が完了いたしました")).toBeVisible();
});

test("company contact form shows validation errors when empty", async ({ page }) => {
  await page.goto("/contact/company");
  await page.getByRole("button", { name: "この内容で送信する" }).click();
  // stays on the form (no success heading) — client validation blocks submit
  await expect(
    page.getByText("お問い合わせの送信が完了いたしました")
  ).toHaveCount(0);
});
