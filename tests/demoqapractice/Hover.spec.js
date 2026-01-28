const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.goto("https://demoqa.com/menu#", {
    waitUntil: "domcontentloaded",
  });

});

test("Assignment 1 — Validate Menu Visibility", async ({ page }) => {

  const mainItem1 = page.getByText("Main Item 1", { exact: true });
  const mainItem2 = page.getByText("Main Item 2", { exact: true });
  const mainItem3 = page.getByText("Main Item 3", { exact: true });

  // TC1
  await expect(mainItem1).toBeVisible();

  // TC2
  await expect(mainItem2).toBeVisible();

  // TC3
  await expect(mainItem3).toBeVisible();
});

test("Assignment 2 — Expand & Validate Main Item 2 Submenu", async ({ page }) => {

  const mainItem2 = page.getByText("Main Item 2", { exact: true });

  // Hover to expand
  await mainItem2.hover();

  // Submenu container under Main Item 2
  const submenuItems = page.locator("#nav li:has-text('Main Item 2') ul > li");

  // TC1: Main Item 2 expands (submenu becomes visible)
  await expect(submenuItems.first()).toBeVisible();

  // TC2: Submenu items “Sub Item” are visible
  const count = await submenuItems.count();

  for (let i = 0; i < count; i++) {
    await expect(submenuItems.nth(i)).toBeVisible();
    await expect(submenuItems.nth(i)).toContainText("Sub Item");
  }
});

test.only("Assignment 3 — Validate Nested Submenus", async ({ page }) => {

  const mainItem2 = page.getByText("Main Item 2", { exact: true });
  const subSubList = page.getByText("SUB SUB LIST »", { exact: true });

  // Step 1: Hover Main Item 2
  await mainItem2.hover();

  // Step 2: Hover SUB SUB LIST »
  await subSubList.hover();

  // Locate deep submenu items
  const deepItems = page.locator(
    "#nav li:has-text('SUB SUB LIST') ul > li"
  );

  // TC1: SUB SUB LIST expands
  await expect(deepItems.first()).toBeVisible();

  // TC2: Sub submenu options visible
  const count = await deepItems.count();

  for (let i = 0; i < count; i++) {
    await expect(deepItems.nth(i)).toBeVisible();
  }
});

// test.only('Result Section Validation', async({page})=>{})