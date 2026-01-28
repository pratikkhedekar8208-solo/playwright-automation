const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/select-menu');
})

test('Assignment 1 — Validate Old Style Select Menu', async ({ page }) => {
    const selectOption = await page.locator(".css-2b097c-container").nth(0);
    const defaultOption = selectOption.locator(".css-1wa3eu0-placeholder");

    await expect(selectOption).toBeVisible();
    await expect(defaultOption).toHaveText("Select Option");

    await selectOption.click();

    await page.getByText("Group 1, option 1", { exact: true }).click();

    const selectedValue = page.locator(".css-1uccc91-singleValue")

    await expect(selectedValue).toHaveText("Group 1, option 1");

})

test.only('Assignment 4 — React-Select Single Value', async ({ page }) => {
    const optionSelect = "Prof."
    const dropdown = page.locator(
        "//div[text()='Select Title']/ancestor::div[contains(@class,'css-yk16xz-control')]"
    );
    await dropdown.click();
    await expect(page.locator(".css-18ng2q5-group")).toHaveText("Pick one title");

    const option = page.getByText(optionSelect, { exact: true });
    await option.click();
    await expect(page.locator(".css-1uccc91-singleValue")).toHaveText(optionSelect);
})

test.only('Assignment 5 — React-Select Multi Values', async({page})=>{

    const multiSelectBox = page.locator(".css-1wa3eu0-placeholder", {hasText : 'Select...'});

    await expect(multiSelectBox).toBeVisible();
    await multiSelectBox.click();

    await multiSelectBox.fill("red");
    await page.keyboard.press('enter');

    
})

// test.only('Result Section Validation', async({page})=>{})