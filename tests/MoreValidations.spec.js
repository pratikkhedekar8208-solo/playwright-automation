const { test, expect } = require('@playwright/test');

test("Popup Validations", async({page})=>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    // await page.goto("https://www.google.com/");
    // await page.goBack();
    // await page.goForward();
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
    await page.locator("#confirmbtn").click();
    await page.on('dialog',dialog => dialog.dismiss());
    await page.locator("#mousehover").hover();
    await page.locator("div.mouse-hover-content a").nth(1).click();

    const framePage= page.frameLocator("#courses-iframe");
    await framePage.locator("nav a[href='/learning-paths']").click();
    const text = await framePage.locator(".text-3xl").nth(0).textContent();
    console.log(text);
})