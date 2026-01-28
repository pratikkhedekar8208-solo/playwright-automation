const {test, expect} = require('@playwright/test');

test.beforeEach(async ({ page }) => {
    await page.goto("https://practice.expandtesting.com/drag-and-drop-circles");
})

test('Navigate to the Page', async({page})=>{
    await expect(page).toHaveURL("https://practice.expandtesting.com/drag-and-drop-circles");
    await expect(page).toHaveTitle("Drag and Drop Circles page for Automation Testing Practice");
})

test('Perform Drag and Drop', async({page})=>{
    const redCircle = page.locator(".red");
    const greenCircle = page.locator(".green");
    const blueCircle = page.locator(".blue");
    const targetToDrag = page.locator("#target");
    const source = page.locator("#source");
    await redCircle.dragTo(targetToDrag);
    await expect(targetToDrag.locator(".red")).toHaveClass("red");
    await greenCircle.dragTo(targetToDrag);
    await blueCircle.dragTo(targetToDrag);
    await expect(source.locator(".blue")).toHaveCount(0);
    await page.screenshot({path : "dragToSquare.png"});
})

test.only('Validate drag-and-drop reset after refresh', async ({ page }) => {

  await page.goto('https://practice.expandtesting.com/drag-and-drop-circles');

  const source = page.locator('#source');
  const target = page.locator('#target');

  const blue = page.locator('.blue');

  // Drag blue to target
  await blue.dragTo(target);

  await expect(source.locator('.blue')).toHaveCount(0);
  await expect(target.locator('.blue')).toBeVisible();

  //  Refresh page
  await page.reload();

  // Re-validate reset state
  await expect(page.locator('#source .blue')).toBeVisible();
  await expect(page.locator('#target .blue')).toHaveCount(0);
});


// test.only('', async({page})=>{})