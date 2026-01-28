const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/radio-button');
})

test.only('Select the yes button', async({page})=>{
    const yes = page.locator("label[for='yesRadio']");
    await yes.click();
    await expect(page.locator(".text-success")).toHaveText("Yes");
})

test.only('Validate the disbale radio button', async({page})=>{
    const no = page.locator("label[for='noRadio']");
    await expect(no).toBeDisabled();
})
// test.only('Result Section Validation', async({page})=>{})