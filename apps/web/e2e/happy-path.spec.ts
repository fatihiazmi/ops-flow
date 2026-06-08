import { test, expect } from "@playwright/test";

const TEST_EMAIL = "admin@opsflow.local";
const TEST_PASSWORD = "password123";

test.describe("OpsFlow E2E Happy Path", () => {
  test("login with valid credentials", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "OpsFlow Login" })).toBeVisible();

    await page.fill("#email", TEST_EMAIL);
    await page.fill("#password", TEST_PASSWORD);
    await page.click("button[type='submit']");

    await expect(page).toHaveURL(/\/tickets/);
  });

  test("logout works", async ({ page }) => {
    await loginViaForm(page);

    const logoutButton = page.locator("button", { hasText: "Logout" });
    await logoutButton.waitFor({ state: "visible", timeout: 5000 });
    await logoutButton.click();

    await expect(page).toHaveURL(/\/login/);
  });

  test("dashboard loads with metrics", async ({ page }) => {
    await loginViaForm(page);

    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await page.waitForTimeout(1000);

    const pageContent = await page.textContent("body");
    expect(pageContent).toContain("Open");
    expect(pageContent).toContain("In Progress");
    expect(pageContent).toContain("Critical");
    expect(pageContent).toContain("SLA Risk Tickets");
  });

  test("ticket list loads", async ({ page }) => {
    await loginViaForm(page);

    await page.goto("/tickets");
    await expect(page.getByRole("heading", { name: "Tickets" })).toBeVisible();
    await page.waitForTimeout(800);

    const pageContent = await page.textContent("body");
    expect(pageContent).toContain("Create Ticket");
  });

  test("ticket detail loads", async ({ page }) => {
    await loginViaForm(page);

    await page.goto("/tickets");
    await expect(page.getByRole("heading", { name: "Tickets" })).toBeVisible();
    await page.waitForTimeout(800);

    const firstRow = page.locator("table tbody tr").first();
    await firstRow.waitFor({ state: "visible", timeout: 5000 });
    await firstRow.click();
    await page.waitForURL(/\/tickets\//);
    // Wait for ticket detail to load (loading skeleton should disappear)
    await page.waitForTimeout(1000);

    const pageContent = await page.textContent("body");
    expect(pageContent).toContain("Status");
    expect(pageContent).toContain("Priority");
  });

  test("create a new ticket", async ({ page }) => {
    await loginViaForm(page);

    await page.goto("/tickets");
    await expect(page.getByRole("heading", { name: "Tickets" })).toBeVisible();
    await page.waitForTimeout(800);

    const createBtn = page.locator("button", { hasText: "Create Ticket" });
    await createBtn.waitFor({ state: "visible", timeout: 5000 });
    await createBtn.click();
    await page.waitForTimeout(500);

    await page.fill("#title", "E2E Test Ticket " + Date.now());
    await page.fill("#description", "Created by Playwright E2E test suite.");
    await page.selectOption("#priority", "low");
    await page.selectOption("#category", "bug");

    await page.click("button[type='submit']");
    await page.waitForTimeout(1000);

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toHaveCount(0);
  });

  test("change ticket status", async ({ page }) => {
    await loginViaForm(page);

    await page.goto("/tickets?status=open");
    await expect(page.getByRole("heading", { name: "Tickets" })).toBeVisible();
    await page.waitForTimeout(800);

    const firstRow = page.locator("table tbody tr").first();
    await firstRow.waitFor({ state: "visible", timeout: 5000 });
    await firstRow.click();
    await page.waitForURL(/\/tickets\//);

    const statusSelect = page.locator("select").first();
    await statusSelect.waitFor({ state: "visible", timeout: 5000 });

    const options = await statusSelect.locator("option").allTextContents();
    const validOption = options.find(
      (o) => o !== "" && o !== "Change status..."
    );
    if (validOption) {
      await statusSelect.selectOption({ label: validOption });

      const toast = page.locator("text=Status updated");
      await expect(toast).toBeVisible({ timeout: 3000 });
    }
  });

  test("add a comment to a ticket", async ({ page }) => {
    await loginViaForm(page);

    await page.goto("/tickets?status=open");
    await expect(page.getByRole("heading", { name: "Tickets" })).toBeVisible();
    await page.waitForTimeout(800);

    const firstRow = page.locator("table tbody tr").first();
    await firstRow.waitFor({ state: "visible", timeout: 5000 });
    await firstRow.click();
    await page.waitForURL(/\/tickets\//);

    const commentTextarea = page.locator("textarea").first();
    await commentTextarea.waitFor({ state: "visible", timeout: 5000 });
    await commentTextarea.fill("E2E test comment " + Date.now());

    const submitBtn = page.locator("button", { hasText: /Submit/ }).first();
    await submitBtn.waitFor({ state: "visible", timeout: 5000 });
    await submitBtn.click();
    await page.waitForTimeout(1000);

    const commentText = await page.textContent("body");
    expect(commentText).toContain("E2E test comment");
  });

  test("full workflow: login -> dashboard -> tickets -> detail -> comment -> logout", async ({ page }) => {
    await loginViaForm(page);

    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await page.waitForTimeout(1000);

    await page.goto("/tickets");
    await expect(page.getByRole("heading", { name: "Tickets" })).toBeVisible();
    await page.waitForTimeout(800);

    const firstRow = page.locator("table tbody tr").first();
    await firstRow.waitFor({ state: "visible", timeout: 5000 });
    await firstRow.click();
    await page.waitForURL(/\/tickets\//);

    const textarea = page.locator("textarea").first();
    if (await textarea.isVisible({ timeout: 3000 })) {
      await textarea.fill("End-to-end workflow comment " + Date.now());
      const submitBtn = page.locator("button", { hasText: /Submit/ }).first();
      await submitBtn.click();
      await page.waitForTimeout(1000);
    }

    const logoutBtn = page.locator("button", { hasText: "Logout" });
    await logoutBtn.waitFor({ state: "visible", timeout: 5000 });
    await logoutBtn.click();
    await expect(page).toHaveURL(/\/login/);
  });
});

async function loginViaForm(page: import("@playwright/test").Page) {
  await page.goto("/login");

  // If already authenticated (token exists), the guard redirects away from /login
  await page.waitForTimeout(300);
  if (page.url().includes("/tickets")) {
    return;
  }

  await page.fill("#email", TEST_EMAIL);
  await page.fill("#password", TEST_PASSWORD);
  await page.click("button[type='submit']");
  await expect(page).toHaveURL(/\/tickets/);
}
