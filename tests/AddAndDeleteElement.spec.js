const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/add-remove-elements');
})

test('Validate “Add Element” Button', async({page})=>{
  const addButton = page.locator("button[onclick='addElement()']");
  await expect(addButton).toBeVisible();
  await expect(addButton).toBeEnabled();
})

test.only('Add a Single Element', async({page})=>{
  const addButton = page.locator("button[onclick='addElement()']");
  const deleteButton = page.locator('button', { hasText: 'Delete' });

  for(let i=0; i<5; i++){
  await addButton.click();
  }
  await deleteButton.first().click();
  await expect(deleteButton).toHaveCount(4);

  for(let i=0; i<4; i++){
    await deleteButton.first().click();
  }

  await expect(deleteButton).toHaveCount(0);

})

// test.only('', async({page})=>{})