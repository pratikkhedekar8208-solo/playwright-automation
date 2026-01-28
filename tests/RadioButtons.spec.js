const {test,expect} = require("@playwright/test");

test.beforeEach(async({page})=>{
    await page.goto("https://practice.expandtesting.com/radio-buttons");
})

test('Navigate to Page and Validate UI', async({page})=>{
    await expect(page).toHaveURL("https://practice.expandtesting.com/radio-buttons")
    await expect(page).toHaveTitle("Radio Buttons page for Automation Testing Practice");
})

test('Validate Default Selection', async({page})=>{
    const radio = page.locator("#blue");
    await expect(radio).toBeChecked();
})

test('Click and Select Radio Buttons', async ({ page }) => {

  const radioButtons = page.locator("input[type='radio']");
  const count = await radioButtons.count();

  for (let i = 0; i < count; i++) {
    const radio = radioButtons.nth(i);

    // ✅ Skip disabled radio button
    if (await radio.isDisabled()) {
      console.log(`Skipping disabled radio at index ${i}`);
      continue;
    }

      if (await radio.isChecked()) {
      console.log(`Radio at index ${i} is already selected by default`);
      await expect(radio).toBeChecked();
      continue;
    }

    if(!page.url().includes("https://practice.expandtesting.com/radio-buttons"))
    {
        await page.goBack();
    }

    await radio.click();
    await expect(radio).toBeChecked();

  }
});

test.only('Validate Label Text and Accessibility', async({page})=>{
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator("label[for='yellow']")).toHaveText("Yellow");
})

// test.only('', async({page})=>{})
