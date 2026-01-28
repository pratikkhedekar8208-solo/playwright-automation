const {test, expect} = require('@playwright/test');
import path from 'path';

test.beforeEach(async ({ page }) => {
    await page.goto("https://practice.expandtesting.com/upload");
})

test('Validate Page', async({page})=>{
    await expect(page).toHaveURL(/upload/);
    await expect(page.locator('h1')).toBeVisible();
})

test('Validate Upload Input Presence', async({page})=>{
    const chooseFile = page.locator("#fileInput");
    const upload = page.locator("#fileSubmit");
    await expect(chooseFile).toBeVisible();
    await expect(upload).toBeVisible();
})

test('Upload a Valid File', async({page})=>{
    const chooseFile = page.locator("#fileInput");
    const upload = page.locator("#fileSubmit");
    const filePath = path.resolve("tests/fixture/drag.png");
    await chooseFile.setInputFiles(filePath);

    await upload.click();

    await expect(page.locator("h1")).toBeVisible();
    await page.screenshot({path : "fileUploaded.png"});
    await expect(page.locator("#uploaded-files p")).toContainText("drag.png");
})

test.only('Validate file required error message', async ({ page }) => {

  await page.goto('https://practice.expandtesting.com/upload');

  const fileInput = page.locator('#fileInput');
  const upload = page.locator('#fileSubmit');

  await upload.click();

  const message = await fileInput.evaluate(
    el => el.validationMessage
  );

  expect(message).toBe('Please select a file.');
});
// test.only('', async({page})=>{})
