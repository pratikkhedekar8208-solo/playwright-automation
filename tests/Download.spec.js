const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
    await page.route('**/*', route => {
    const url = route.request().url();

    // Allow only AUT
    if (url.includes('practice.expandtesting.com')) {
      route.continue();
    } else {
      route.abort(); // 🚫 block ads, trackers, redirects
    }
  });

  await page.goto('https://practice.expandtesting.com/download');
})

test('Navigate to Page', async({page})=>{
    await expect(page).toHaveURL(/download/);
    await expect(page.locator("h1")).toBeVisible();
})

test('Validate Download Link', async({page})=>{
    const image = page.locator("a[data-testid='cdct.jpg']");
    await expect(image).toBeVisible();
})

test('Intercept the Download', async({page})=>{
    await page.route('**bentham.manuscriptpoint.com/**', route => route.abort());
    const image = page.locator("a[data-testid='cdct.jpg']");
    const expectedFileName = (await image.innerText()).trim();
    const [download] = await Promise.all([page.waitForEvent('download'), image.click()]);
    const pathToSave = await download.path();
    console.log("Download Path : ", pathToSave);
    const fileName = await download.suggestedFilename();
    expect(fileName).toContain(expectedFileName);
})

import path from 'path';
import fs from 'fs';

test.only('Intercept1 the Download', async ({ page }) => {

  const image = page.locator("a[data-testid='cdct.jpg']");
  const expectedFileName = (await image.innerText()).trim();

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    image.click()
  ]);

  const saveDir = path.resolve(process.cwd(), 'tests', 'fixture');

  if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir, { recursive: true });
  }

  const fileName = download.suggestedFilename();
  const savePath = path.join(saveDir, fileName);

  await download.saveAs(savePath);

  expect(fs.existsSync(savePath)).toBe(true);
  expect(fileName).toContain(expectedFileName);

  const fileContent = await fs.readFileSync(savePath,"utf-8");
  expect(fileContent).toContain("jpeg");

  const fileSize = (await fs.promises.stat(savePath)).size;
  console.log(fileSize);

});


// test.only('', async({page})=>{})



