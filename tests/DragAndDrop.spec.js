const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
    await page.goto("https://practice.expandtesting.com/drag-and-drop");
})

test('Navigate & Validate Page', async ({ page }) => {
    await expect(page).toHaveURL("https://practice.expandtesting.com/drag-and-drop");
    await expect(page).toHaveTitle("Drag and Drop page for Automation Testing Practice");

})

test('Identify Draggable & Droppable Elements', async ({ page }) => {
    const draggable = await page.locator("#column-a");
    const droppable = await page.locator("#column-b");
    await expect(draggable).toBeVisible();
    await expect(droppable).toBeVisible();
})

test.only('', async ({ page }) => {
    const draggable = await page.locator("#column-a");
    const droppable = await page.locator("#column-b");
    await draggable.dragTo(droppable);
    await page.screenshot({path : "drag.png"})
    expect(draggable).toHaveText('B');
    expect(droppable).toHaveText('A');
})
// test.only('', async({page})=>{})