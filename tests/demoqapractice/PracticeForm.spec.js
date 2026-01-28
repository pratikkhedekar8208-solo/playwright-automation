const { test, expect } = require("@playwright/test");
import path from "path";

test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/automation-practice-form');
})

test.only('Result Section Validation', async({page})=>{
    const firstName = page.locator("#firstName");
    const lastName = page.locator("#lastName");
    const userEmail = page.locator("#userEmail");
    const userNumber = page.locator("#userNumber");
    const dateOfBirth = page.locator("#dateOfBirthInput");
    const subject = page.locator("#subjectsContainer");
    const upload = page.locator("#uploadPicture");
    const filePath = path.resolve("tests/fixture/drag.png");
    const state = page.locator(".css-tlfecz-indicatorContainer");
    const city = page.locator("#city");
    await firstName.fill("Rahul");
    await lastName.fill("Gandhi");
    await userEmail.fill("rahulgandhi1234@gmail.com");
    await page.locator("label[for='gender-radio-1']").click();
    await userNumber.fill("8912573987")
    await dateOfBirth.fill('21-03-2024');
    await page.locator("label[for='hobbies-checkbox-1']").check();
    await page.locator("#uploadPicture").setInputFiles(filePath);
    await page.locator("#currentAddress").fill("Mumbai")
    await state.nth(0).click();
    await page.getByText("Haryana").click();
    await city.click();
    await page.locator('#city >> text=Panipat').click();
    await page.locator("#submit").click();
    await page.screenshot({path : 'PracticeFormSubmission.png'});
    
})

// test.only('Result Section Validation', async({page})=>{})