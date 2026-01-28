const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/alerts');
})

test('Validate Immediate Alert', async ({ page }) => {
    const alertButton = page.locator("#alertButton");


    page.on('dialog', async (dialog) => {
        console.log(dialog.type());
        console.log(dialog.message());
        await dialog.accept();
    })

    await alertButton.click();


    await expect(alertButton).toBeVisible();
})

test('Validate Timer Alert', async ({ page }) => {
    const timerAlertButton = page.locator("#timerAlertButton");

    const [dialog] = await Promise.all([page.waitForEvent('dialog'), timerAlertButton.click()]);

    console.log(dialog.message());
    await dialog.accept();

    expect(timerAlertButton).toBeVisible();
})

test('Validate Confirm Alert (OK)', async ({ page }) => {

    const confirmButton = page.locator("#confirmButton");

    page.on('dialog', async (dialog) => {
        console.log(dialog.type());
        await dialog.accept();
    })

    await confirmButton.click();
    const text = await page.locator("#confirmResult").innerText();
    await expect(text).toContain("Cancel");

})

test('Validate Confirm Alert (Cancel)', async ({ page }) => {

    const confirmButton = page.locator("#confirmButton");

    page.on('dialog', async (dialog) => {
        console.log(dialog.type());
        console.log(dialog.message());
        await dialog.dismiss();
    })

    await confirmButton.click();
    const text = await page.locator("#confirmResult").innerText();
    await expect(text).toContain("Cancel");

})

test('Prompt Alert (Enter Text + OK)', async ({ page }) => {

    const promptButton = page.locator("#promtButton");
    const inputText = "Hello";

    page.on('dialog', async (dialog) => {
        console.log(dialog.type());
        await dialog.accept(inputText);
    })

    await promptButton.click();
    const text = await page.locator("#promptResult").innerText();
    await expect(text).toContain(inputText);

})

test('Prompt Alert (Cancel)', async ({ page }) => {

    const promptButton = page.locator("#promtButton");

    page.on('dialog', async (dialog) => {
        console.log(dialog.type());
        await dialog.dismiss();
    })

    await promptButton.click();
    const text = page.locator("#promptResult");
    await expect(text).not.toBeVisible();

})

test('Combined Alert Flow', async ({ page }) => {
    const promptText = 'Playwright User';

    page.on('dialog', async (dialog) => {
        const type = dialog.type();
        const massage = dialog.message();

        console.log("Dialog Type is ", type);
        console.log("Dialog Message ", massage);

        if (type == 'alert') {
            await dialog.accept();
        }

        if (type == 'confirm') {
            await dialog.dismiss();
        }

        if (type == 'prompt') {
            await dialog.accept(promptText);
        }
    })

    await page.locator("#alertButton").click();

    await page.locator("#timerAlertButton").click();

    await page.locator("#confirmButton").click();
    await expect(page.locator("#confirmResult")).toContainText("You selected");

    await page.locator("#promtButton").click();
    await expect(page.locator("#promptResult")).toContainText(promptText);
})

test.only('Negative Alert Handling', async ({ page }) => {
    const timerAlertButton = await page.locator("#timerAlertButton");

    let alertAppeared = true;

    try {
        await timerAlertButton.click();
        await page.waitForEvent('dialog', { timeout: 3000 });
    } catch (error) {
        alertAppeared = false;
        console.log("Alert is not appered within timeout");
        console.log("Error Message ", error.message);
    }

    expect(alertAppeared).toBeFalsy();
})


// test.only('', async({page})=>{})