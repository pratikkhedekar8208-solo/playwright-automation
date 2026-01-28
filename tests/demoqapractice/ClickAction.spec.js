const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/buttons');
})

test('Validate Double Click', async({page})=>{
    const doubleClick = page.locator("#doubleClickBtn")
    await doubleClick.dblclick();
    await expect(page.locator("#doubleClickMessage")).toBeVisible();
})

test('Validate Right Click', async({page})=>{
    const rightClick = page.locator("#rightClickBtn")
    await rightClick.click({button : 'right'});
    await expect(page.locator("#rightClickMessage")).toBeVisible();
})

test.only('Validate Left Click', async({page})=>{
    const leftClick = await page.locator('button',{hasText : 'Click Me'}).nth(2);
    await leftClick.click();
    await expect(page.locator("#dynamicClickMessage")).toBeVisible();
})

// test.only('Result Section Validation', async({page})=>{})