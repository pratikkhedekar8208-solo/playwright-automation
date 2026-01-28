const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/radio-button');
})


// test.only('Result Section Validation', async({page})=>{})