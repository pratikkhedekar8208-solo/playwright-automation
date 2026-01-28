const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/progress-bar');
})

test('Assignment 1 — Default Progress Bar Value Objective', async({page})=>{
    const progressBar = page.locator("#progressBar");
    const progressBarValue = await page.locator(".progress-bar").textContent()

    await expect(progressBar).toBeVisible();
    await expect(progressBarValue).toContain("0%");
})

test('Assignment 2 — Start Progress Bar', async({page})=>{
    const startButton = page.locator("#startStopButton");
    const progressBar = await page.locator(".progress-bar");

    const initialValue = await progressBar.getAttribute("aria-valuenow");
    const initialProgress = Number(initialValue);

    await startButton.click();

    await page.waitForTimeout(500);

    const updatedValue = await progressBar.getAttribute("aria-valuenow");
    const updateProgress = Number(updatedValue);
    console.log(initialProgress, updateProgress)

    await expect(updateProgress).toBeGreaterThan(initialProgress);
})

test('Assignment 5 — Complete to 100%', async({page})=>{
    const progressValue = page.locator(".progress-bar");
    const startButton = page.locator("#startStopButton");

    await page.waitForLoadState();

    await startButton.click();

  // Wait until progress reaches 100
  await expect(progressValue).toHaveAttribute('aria-valuenow', '100');

  // Validate final value
  const finalValue = await progressValue.getAttribute('aria-valuenow');
  expect(Number(finalValue)).toBe(100);

  // Validate button changed to Reset
  await expect(page.locator("#resetButton")).toBeVisible();

})

test('Assignment 6 — UI Responsiveness During Progress', async({page})=>{
    const startButton = page.locator("#startStopButton");
    const navToggler = page.locator(".navbar-toggler");
    const headerText = page.locator(".header-text",{hasText :"Elements"});
    const textBox = page.locator(".text", {hasText : "Text Box"})


    await page.waitForLoadState();

    await startButton.click();
    await page.waitForTimeout(500);
    await headerText.click();
    await expect(textBox).toBeVisible();


})

test('Assignment 7 — Repeated Start/Stop Flow', async ({ page }) => {
  await page.goto('https://demoqa.com/progress-bar');

  const startStopBtn = page.locator('#startStopButton');
  const progressBar = page.locator('.progress-bar');

  // Helper to read progress as number
  const getProgress = async () =>
    Number(await progressBar.getAttribute('aria-valuenow'));

  // ---------- Cycle 1 ----------
  await startStopBtn.click(); // Start

  await expect(progressBar).toHaveAttribute('aria-valuenow', /[1-9]/);

  const valueAfterStart1 = await getProgress();

  await startStopBtn.click(); // Stop

  const valueAfterStop1 = await getProgress();

  expect(valueAfterStop1).toBeGreaterThanOrEqual(valueAfterStart1);

  // ---------- Cycle 2 ----------
  await startStopBtn.click(); // Start again

  await expect(progressBar).not.toHaveAttribute(
    'aria-valuenow',
    String(valueAfterStop1)
  );

  const valueAfterStart2 = await getProgress();

  await startStopBtn.click(); // Stop again

  const valueAfterStop2 = await getProgress();

  // ---------- Assertions ----------
  // TC1: Cycles do not break
  expect(valueAfterStop2).toBeGreaterThanOrEqual(valueAfterStop1);

  // TC2: Value increases after each start
  expect(valueAfterStart2).toBeGreaterThan(valueAfterStop1);
});

test.only('Assignment 8 — Edge Case: Immediate Stop After Start', async ({ page }) => {
  await page.goto('https://demoqa.com/progress-bar');

  const startStopBtn = page.locator('#startStopButton');
  const progressBar = page.locator('.progress-bar');

  const getProgress = async () =>
    Number(await progressBar.getAttribute('aria-valuenow'));

  // Initial value
  const initialValue = await getProgress();

  // Start
  await startStopBtn.click();

  // Wait for at least one increment
  await expect(progressBar).toHaveAttribute('aria-valuenow', /[1-9]/);

  // Stop immediately
  await startStopBtn.click();

  const stoppedValue = await getProgress();

  // ---------- Assertions ----------
  // TC1: Progress increments at least once
  expect(stoppedValue).toBeGreaterThan(initialValue);

  // TC2: Stop works immediately (value is small)
  expect(stoppedValue).toBeLessThan(20); // safe small threshold
});



// test.only('Result Section Validation', async({page})=>{})