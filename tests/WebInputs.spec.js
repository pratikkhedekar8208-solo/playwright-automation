const { test,expect } = require("@playwright/test");

test('Web Elements',async({page})=>{
    const inputNumber = page.locator("#input-number");
    const inputText = page.locator("#input-text");
    const inputPassword = page.locator("#input-password");
    const inputDate = page.locator("input-date");
    const closeAdIfPresent = async(page)=>{
        const closeButton = page.locator('button', {hasText : 'Close'});
        if(await closeButton.isVisible({timeout : 3000})){
            await closeButton.click();
        }
    }
    await page.goto('https://practice.expandtesting.com/');
    //await closeAdIfPresent(page);
    await page.locator("a[href*='/inputs']").first().click();
    await page.locator('button', {hasText : 'Display Inputs'}).click();
    // await page.locator('button', {hasText : 'Display Inputs'}).click();
    await inputNumber.fill("75");
    await inputText.fill("Donald Trump");
    await inputPassword.fill("trump");
    await page.pause();


})
