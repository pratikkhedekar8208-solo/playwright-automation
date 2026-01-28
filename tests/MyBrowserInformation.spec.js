const {test, expect} = require("@playwright/test");

test.beforeEach(async({page})=>{
    await page.goto("https://practice.expandtesting.com/my-browser");
})

test('Launch and Validate page', async ({page})=>{
    await expect(page).toHaveURL("https://practice.expandtesting.com/my-browser")
    await expect(page.locator('li',{hasText:"My Browser Information"})).toBeVisible();
})

test("Validate Browser Name", async({page})=>{
    expect(await page.evaluate(() => navigator.userAgent)).toContain("Chrome");
})

test('Validate Displayed Browser Info', async({page})=>{
    await page.locator("#browser-toggle").click();
    await expect(page.locator("#browser-user-agent")).toBeVisible();
    await expect(page.locator("#browser-name")).toBeVisible();
    await expect(page.locator("#browser-cookie")).toBeVisible();
    await expect(page.locator("#browser-platform")).toBeVisible();
})

test('Responsive Viewport Testing', async({page})=>{
await page.setViewportSize({ width: 375, height: 812 }); // Mobile
await page.screenshot({ path: 'mobile.png' });

await page.setViewportSize({ width: 1366, height: 768 }); // Laptop
await page.screenshot({ path: 'laptop.png' });
})

test.only('Browser Console Log Capture', async({page})=>{
page.on('console', msg => {
  expect(msg.type()).not.toBe('error');
});
})

// test.only('', async({page})=>{})