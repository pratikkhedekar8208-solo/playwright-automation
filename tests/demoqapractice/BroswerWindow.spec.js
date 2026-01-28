const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/browser-windows');
})



test('Validate New Tab Content', async({page})=>{
    const newTab = page.locator("#tabButton");
    const [newPage] = await Promise.all([page.context().waitForEvent('page'), newTab.click()]);
    await newPage.waitForLoadState();
    await expect(newPage.locator("h1")).toBeVisible();
    await page.bringToFront();
    // await newPage.close();
    await expect(newTab).toBeVisible();

})

test('handle new window', async ({ page }) => {

  const [newWindow] = await Promise.all([
    page.context().waitForEvent('page'),
    page.locator('#windowButton').click(),
  ]);

  await newWindow.waitForLoadState();

  await expect(newWindow.locator('h1')).toHaveText('This is a sample page');

  // optional
  await newWindow.close();
  await page.bringToFront();
});

test('Validate New Window Message', async({page})=>{
    const [newWindowMassage] = await Promise.all([
    page.context().waitForEvent('page'),
    page.locator('#messageWindowButton').click(),
  ]);

  await newWindowMassage.waitForLoadState();

  await expect(newWindowMassage.locator('body')).toContainText('Knowledge increases by sharing but not by saving');

  // optional
  await newWindowMassage.close();
  await page.bringToFront();
})

test.only('Window Handles Management', async({page})=>{
    const context = page.context();

    const mainPage = page;

    async function openAndCapture(buttonLocator){
        const [newPage] = await Promise.all([context.waitForEvent('page'), buttonLocator.click()]);

        await newPage.waitForLoadState();
        return newPage;
    }

    const newTab = await openAndCapture(page.locator('#tabButton'));
    const newWindow = await openAndCapture(page.locator('#windowButton'));
    const newWindowMassage = await openAndCapture(page.locator('#messageWindowButton'));

    const count = context.pages().length;
    console.log(count);

    const childWindows = [newTab, newWindow, newWindowMassage];

    for(const child of childWindows){
        await child.bringToFront();

        let text;

        if (await child.locator('h1').count() > 0) {
    text = await child.locator('h1').innerText();
  } 
  // Else → use body text (message window)
  else {
    text = await child.evaluate(() => document.body.innerText);
  }

        console.log('----------------------------');
        console.log('Child Window Text:');
        console.log(String(text || '').trim());

    }

    for(const child of childWindows){
        await child.close();
    }

    await mainPage.bringToFront();

    await expect(mainPage).toHaveURL(/browser-windows/);


})
// test.only('Result Section Validation', async({page})=>{})