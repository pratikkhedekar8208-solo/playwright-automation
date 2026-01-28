const {test, expect} = require('@playwright/test');

test.beforeEach(async ({ page }) => {
    await page.goto("https://practice.expandtesting.com/form-validation");
})

test('Navigate to the Page', async({page})=>{
    await expect(page).toHaveURL(/form-validation/);
    await expect(page.locator("h1")).toBeVisible();
})

test('Validate Empty Submission', async({page})=>{
    const contactName = page.locator("#validationCustom01");
    const contactNumber = page.locator('input[name="contactnumber"]');
    const paymentOptions = page.locator('select[name="payment"]');
    const errorXpath = 'xpath=following-sibling::div[contains(@class,"invalid-feedback")]';
    // const contactNameError = await page.locator(".col-md-6").nth(0);
    // const contactNumberError = await page.locator(".col-md-6").nth(1);
    // const paymentError = await page.locator(".col-md-6").nth(3);
    const submit = page.locator(".btn.btn-primary ");

    await contactName.fill("");
    await submit.click();
    // await expect(contactNameError.locator(".invalid-feedback")).toHaveText("Please enter your Contact name.");
    // await expect(contactNumberError.locator(".invalid-feedback")).toHaveText("Please provide your Contact number.");
    // await expect(paymentError.locator(".invalid-feedback")).toHaveText("Please select the Paymeny Method.");
    await expect(contactName.locator(errorXpath)).toHaveText("Please enter your Contact name.");
    await expect(contactNumber.locator(errorXpath)).toHaveText("Please provide your Contact number.");
    await expect(paymentOptions.locator(errorXpath)).toHaveText("Please select the Paymeny Method.");


})

test.only('Full Valid Form Submission', async({page})=>{
    const contactName = page.locator("#validationCustom01");
    const contactNumber = page.locator('input[name="contactnumber"]');
    const paymentOptions = page.locator('select[name="payment"]');
    const date = page.locator("input[name='pickupdate']");
    const submit = page.locator(".btn.btn-primary ");

    await contactName.fill("Ganesha")
    await contactNumber.fill("080-2487324");
    await paymentOptions.selectOption("card");
    await date.fill("2026-01-01");
    await page.screenshot({path : "formEntries.png"})
    await submit.click();
    await expect(page.locator("h1")).toHaveText("Form Confirmation page for Automation Testing Practice");
})
// test.only('', async({page})=>{})