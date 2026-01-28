const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/auto-complete');
})

test('Assignment 1 — Single Auto-Complete Selection', async ({ page }) => {

  // ✅ Correct input field
  const input = page.locator('#autoCompleteSingleInput');

  await input.first().fill('re');

  // ✅ Correct suggestion locator
  const redOption = page.locator('.auto-complete__option', { hasText: 'Red' });
  await expect(redOption).toBeVisible();

  await redOption.click();

  const chip = await page.locator(".auto-complete__single-value",{hasText : "Red"});

  // ✅ Verify selected value
  await expect(chip).toBeVisible();
});

test('Multiple Auto-Complete Selection', async({page})=>{
    const multiInputColors = page.locator("#autoCompleteMultipleInput");

    await multiInputColors.fill("bl");
    const blueOption = page.locator(".auto-complete__option", {hasText : "Blue"});
    await blueOption.click();
    await multiInputColors.fill("ye");
    const yellowOption = page.locator(".auto-complete__option", {hasText : "Yellow"});
    await yellowOption.click();
    const selectedBlue = await page.locator(".auto-complete__multi-value").nth(0);
    const selectedYellow = await page.locator(".auto-complete__multi-value").nth(1);
    await expect (selectedBlue).toBeVisible();
    await expect (selectedYellow).toBeVisible();


})

test('Assignment 3 — No Suggestion Handling', async ({ page }) => {

  const input = page.locator('#autoCompleteSingleInput');

  const nonsenseText = 'xyzabc';

  // Type invalid color
  await input.fill(nonsenseText);

  // TC1: Validate no suggestion list is shown
  const suggestions = page.locator('.auto-complete__option');
  await expect(suggestions).toHaveCount(0);

  // TC2: Validate input retains entered text
  await expect(input).toHaveValue(nonsenseText);
});

test('Assignment 4 — Backspace Removal in Multiple Field', async ({ page }) => {
  await page.goto('https://demoqa.com/auto-complete');

  const input = page.locator('#autoCompleteMultipleInput');

  // Select Red
  await input.fill('re');
  await page.locator('.auto-complete__option', { hasText: 'Red' }).click();

  // Select Blue
  await input.fill('bl');
  await page.locator('.auto-complete__option', { hasText: 'Blue' }).click();

  // Validate 2 selections
  const chips = page.locator('.auto-complete__multi-value__label');
  await expect(chips).toHaveCount(2);

  // Focus input and press backspace to remove last selected (Blue)
  await input.click();
  await input.press('Backspace');

  // TC1: Only one chip should remain
  await expect(chips).toHaveCount(1);

  // TC2: Remaining value should be Red
  await expect(chips.first()).toHaveText('Red');
});

test('Assignment 5 — Case-Insensitive Selection', async ({ page }) => {
  await page.goto('https://demoqa.com/auto-complete');

  const input = page.locator('#autoCompleteSingleInput');
  const selectedValue = page.locator('.auto-complete__single-value');

  // Uppercase
  await input.fill('RE');
  await page.locator('.auto-complete__option', { hasText: 'Red' }).click();
  await expect(selectedValue).toHaveText('Red');

  // Lowercase
  await input.fill('re');
  await page.locator('.auto-complete__option', { hasText: 'Red' }).click();
  await expect(selectedValue).toHaveText('Red');
});

test('Assignment 6 — UI Stability After Selection', async ({ page }) => {
  // --- Capture JS errors ---
  const jsErrors = [];
  page.on('pageerror', err => jsErrors.push(err.message));

  await page.goto('https://demoqa.com/auto-complete');

  // ---------- Single auto-complete ----------
  const singleInput = page.locator('#autoCompleteSingleInput');

  await singleInput.fill('re');
  await page.locator('.auto-complete__option', { hasText: 'Red' }).click();

  // Validate selection rendered (not input value)
  const singleValue = page.locator('.auto-complete__single-value');
  await expect(singleValue).toHaveText('Red');

  // ---------- Multiple auto-complete ----------
  const multiInput = page.locator('#autoCompleteMultipleInput');

  await multiInput.fill('bl');
  await page.locator('.auto-complete__option', { hasText: 'Blue' }).click();

  await multiInput.fill('ye');
  await page.locator('.auto-complete__option', { hasText: 'Yellow' }).click();

  const chips = page.locator('.auto-complete__multi-value__label');
  await expect(chips).toHaveCount(2);

  // ---------- Click somewhere else ----------
  await page.locator('h1').click(); // click page title

  // ---------- TC2: Inputs still editable ----------
  await singleInput.fill('gr');
  await expect(singleInput).toHaveValue('gr');

  await multiInput.fill('re');
  await expect(multiInput).toHaveValue('re');
});

test('Assignment 7 — Keyboard Navigation', async ({ page }) => {
  await page.goto('https://demoqa.com/auto-complete');

  const input = page.locator('#autoCompleteSingleInput');
  const selectedValue = page.locator('.auto-complete__single-value');

  // Focus input
  await input.click();

  // Type partial text
  await input.fill('bl');

  // Wait for suggestions
  const options = page.locator('.auto-complete__option');
  await expect(options.first()).toBeVisible(); // TC1 (suggestions exist)

  // Navigate with keyboard
  await input.press('ArrowDown');  // highlight first suggestion
  await input.press('Enter');      // select it

  // Validate selection rendered
  await expect(selectedValue).toHaveText('Black'); // TC2
});

test.only('Assignment 8 — Combined Auto-Complete Flow', async ({ page }) => {
  await page.goto('https://demoqa.com/auto-complete');

  // ---------- Single auto-complete ----------
  const singleInput = page.locator('#autoCompleteSingleInput');
  const singleValue = page.locator('.auto-complete__single-value');

  await singleInput.fill('re');
  await page.locator('.auto-complete__option', { hasText: 'Red' }).click();
  await expect(singleValue).toHaveText('Red');

  // ---------- Multiple auto-complete ----------
  const multiInput = page.locator('#autoCompleteMultipleInput');

  const selectColor = async (partial, color) => {
    await multiInput.fill(partial);
    await page.locator('.auto-complete__option', { hasText: color }).click();
  };

  await selectColor('bl', 'Blue');
  await selectColor('ye', 'Yellow');
  await selectColor('gr', 'Green');

  let chips = page.locator('.auto-complete__multi-value__label');
  await expect(chips).toHaveCount(3);

  // ---------- Remove one selection (remove Yellow) ----------
  await page.locator('.auto-complete__multi-value__label', { hasText: 'Yellow' }).locator('..').locator('.auto-complete__multi-value__remove').click();

  // ---------- Validate remaining selections ----------
  chips = page.locator('.auto-complete__multi-value__label');

  await expect(chips).toHaveCount(2);

  const remaining = await chips.allTextContents();
  expect(remaining.sort()).toEqual(['Blue', 'Green']); // TC2
});




// test.only('Result Section Validation', async({page})=>{})