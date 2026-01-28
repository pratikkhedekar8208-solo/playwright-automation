const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/checkbox');
})

test('Expand All Nodes', async ({ page }) => {
    const expand = page.locator("button svg.rct-icon-expand-all");
    const home = page.getByText("Home");
    await expand.click()
    await expect(page.getByText("Desktop")).toBeVisible();
    await expect(page.getByText("WorkSpace")).toBeVisible();
    await expect(page.getByText("Public")).toBeVisible();
    await expect(page.getByText("Downloads")).toBeVisible();

    await home.click();
    await expect(page.locator(".rct-icon-check")).toHaveCount(17);


})

test('Click on Home checkbox', async ({ page }) => {
    const expand = page.locator("button svg.rct-icon-expand-all");
    const home = page.getByText("Home");
    await expand.click()

    await home.click();
    await expect(page.locator(".rct-icon-check")).toHaveCount(17);
})

test('Select Specific Folder', async ({ page }) => {
    const expand = page.locator("button svg.rct-icon-expand-all");
    const workSpace = page.getByText("WorkSpace");
    await expand.click()
    await workSpace.click();
    await expect(page.getByLabel("React")).toBeChecked();
    await expect(page.getByLabel("Angular")).toBeChecked();
    await expect(page.getByLabel("Veu")).toBeChecked();
    await expect(page.getByLabel("Office")).not.toBeChecked();
})

test('Uncheck Child Checkbox', async ({ page }) => {
    const expand = page.locator("button svg.rct-icon-expand-all");
    const home = page.getByText("Home");
    const desktopCheckbox = page.locator(".rct-title", { hasText: "Desktop" })
    await expand.click()
    await home.click();
    // Check first (ensure known state)
    await desktopCheckbox.check();

    // Uncheck
    await desktopCheckbox.uncheck();

    await expect(desktopCheckbox).not.toBeChecked();
})

test('Expand Validation and Collapse', async({page})=>{
    const expand = page.locator("button svg.rct-icon-expand-all");
    const collapse = page.locator("button[title='Collapse all']");
    await expand.click();
    await expect(page.locator(".rct-title", { hasText: "Desktop" })).toBeVisible();
    await collapse.click();
    await expect(page.locator(".rct-title", { hasText: "Desktop" })).not.toBeVisible();

})

test.only('Result Section Validation', async({page})=>{
    const expand = page.locator("button svg.rct-icon-expand-all");
    await expand.click();
    // Select multiple checkboxes
  await page.locator(".rct-title", { hasText: "Notes" }).check();
  await page.locator(".rct-title", { hasText: "Word File.doc" }).check();
  await page.locator(".rct-title", { hasText: "Private" }).check();

  // Get result text
  const resultText = await page.locator('#result').innerText();

  // Normalize result text (lowercase + trim)
  const normalizedResult = resultText
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  // Assertions
  expect(normalizedResult).toContain('notes');
  expect(normalizedResult).toContain('private');
  expect(normalizedResult).toContain('wordfile');
})
// test.only('Result Section Validation', async({page})=>{})