const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/nestedframes');
})

test('Assignment 1 — Validate Parent Frame Text', async({page})=>{
    const parentFrame = page.frameLocator("#frame1");
    const text = await parentFrame.locator("body").innerText();
    await expect(text).toContain("Parent frame");
    await expect(page.locator("h1")).toContainText("Nested Frames");
})

test('Assignment 2 — Validate Child Frame Text', async({page})=>{
    const parentFrame = page.frameLocator("#frame1");
    const childFrame = parentFrame.frameLocator("iframe");
    const text = await childFrame.locator("body p").textContent();
    await expect(text).toContain("Child Iframe");
    await expect(page.locator("h1")).toContainText("Nested Frames");
})

test('Assignment 3 — Parent and Child Comparison', async ({ page }) => {

  // Parent frame
  const parentFrame = page.frameLocator('#frame1');
  const parentText = await parentFrame.locator('body').textContent();

  // Child frame (inside parent)
  const childFrame = parentFrame.frameLocator('iframe');
  const childText = await childFrame.locator('p').textContent();

  console.log('Parent text:', parentText?.trim());
  console.log('Child text:', childText?.trim());

  // Compare
  expect(parentText.trim()).not.toBe(childText.trim());
});

test.only('Assignment 4 — Negative Frame Navigation', async ({ page }) => {
  await page.goto('https://demoqa.com/nestedframes');

  let errorMessage = '';

  try {
    // ❌ Wrong: trying to access child frame directly from main page
    const childFrameDirect = page.frameLocator('iframe');

    // Force an action to trigger the error
    await childFrameDirect.locator('p').textContent({ timeout: 3000 });

  } catch (error) {
    errorMessage = error.message;
    console.log('Captured error:', errorMessage);
  }

  // Validate error was captured
  expect(errorMessage.length).toBeGreaterThan(0);
});


// test.only('Result Section Validation', async({page})=>{})