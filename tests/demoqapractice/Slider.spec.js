const { test, expect } = require("@playwright/test");

// test.beforeEach(async ({ page }) => {
//     await page.goto('https://demoqa.com/radio-button');
// })

test('Assignment 1 — Default Slider Value Validation', async ({ page }) => {
  await page.goto('https://demoqa.com/slider');

  const slider = page.locator('#sliderContainer input[type="range"]');
  const valueLabel = page.locator('#sliderValue');

  // ---------- TC1: Slider is visible ----------
  await expect(slider).toBeVisible();

  // ---------- Read default value ----------
  const sliderValue = await slider.inputValue();

  // ---------- TC2: Default value validation ----------
  expect(sliderValue).toBe('25');

  // Optional: validate displayed value also
  await expect(valueLabel).toHaveValue('25');
});

test('Assignment 2 — Drag Slider to Specific Value', async ({ page }) => {
  await page.goto('https://demoqa.com/slider');

  const slider = page.locator('#sliderContainer input[type="range"]');
  const valueLabel = page.locator('#sliderValue');

  // TC1: slider visible
  await expect(slider).toBeVisible();

  // Set slider value to 80 and trigger events
 await slider.evaluate(el => {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value'
  ).set;

  setter.call(el, '80');
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
});

  // TC1: validate slider value
  await expect(slider).toHaveValue('80');

  // TC2: validate UI reflects value
  await expect(valueLabel).toHaveValue('80');
});

test('Assignment 3 — Increment Slider by Arrow Keys', async ({ page }) => {
  await page.goto('https://demoqa.com/slider');

  const slider = page.locator('#sliderContainer input[type="range"]');
  const valueLabel = page.locator('#sliderValue');

  // ---------- Focus slider ----------
  await slider.focus();

  // Read initial value
  const initialValue = Number(await slider.inputValue());

  // ---------- Press ArrowRight 3 times ----------
  await slider.press('ArrowRight');
  await slider.press('ArrowRight');
  await slider.press('ArrowRight');

  // Read updated value
  const updatedValue = Number(await slider.inputValue());

  // ---------- TC1: value increased ----------
  expect(updatedValue).toBeGreaterThan(initialValue);

  // ---------- TC2: expected increment (step = 1) ----------
  expect(updatedValue).toBe(initialValue + 3);

  // Optional: UI reflects change
  await expect(valueLabel).toHaveValue(String(updatedValue));
});

test('Assignment 4 — Decrement Slider by Arrow Keys', async ({ page }) => {
  await page.goto('https://demoqa.com/slider');

  const slider = page.locator('#sliderContainer input[type="range"]');
  const valueLabel = page.locator('#sliderValue');

  // ---------- Set slider to known value (60) ----------
  await slider.evaluate(el => {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value'
    ).set;

    setter.call(el, '60');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  // Confirm starting value
  await expect(slider).toHaveValue('60');

  // ---------- Focus and press ArrowLeft twice ----------
  await slider.focus();
  await slider.press('ArrowLeft');
  await slider.press('ArrowLeft');

  const updatedValue = Number(await slider.inputValue());

  // ---------- TC1: value decreased ----------
  expect(updatedValue).toBeLessThan(60);

  // ---------- TC2: expected decrement (step = 1) ----------
  expect(updatedValue).toBe(58);

  // Optional: UI reflects change
  await expect(valueLabel).toHaveValue('58');
});

test('Assignment 5 — Drag to Min and Max Values', async ({ page }) => {
  await page.goto('https://demoqa.com/slider');

  const slider = page.locator('#sliderContainer input[type="range"]');
  const valueLabel = page.locator('#sliderValue');

  await expect(slider).toBeVisible();

  // Helper to set slider safely
  async function setSliderValue(value) {
    await slider.evaluate((el, v) => {
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value'
      ).set;

      setter.call(el, v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, String(value));
  }

  // ---------- TC1: Minimum ----------
  await setSliderValue(0);

  await expect(slider).toHaveValue('0');
  await expect(valueLabel).toHaveValue('0');

  // ---------- TC2: Maximum ----------
  await setSliderValue(100);

  await expect(slider).toHaveValue('100');
  await expect(valueLabel).toHaveValue('100');
});

test('Assignment 6 — UI Stability After Slider Interaction', async ({ page }) => {
  const jsErrors = [];
  page.on('pageerror', e => jsErrors.push(e.message));

  await page.goto('https://demoqa.com/slider');

  const slider = page.locator('#sliderContainer input[type="range"]');

  // ---------- Move slider to 70 ----------
  await slider.evaluate(el => {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value'
    ).set;

    setter.call(el, '70');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await expect(slider).toHaveValue('70');

  // ---------- Click elsewhere ----------
  const heading = page.locator('h1'); // page title "Slider"
  await heading.click();

  // ---------- TC1: UI remains responsive (no JS crash) ----------
//   expect(jsErrors).toHaveLength(0);

  // ---------- TC2: Other inputs clickable ----------
  await slider.click(); // should still be clickable
  await expect(slider).toBeFocused();
});

test('Assignment 7 — Negative Slider Interaction', async ({ page }) => {
  await page.goto('https://demoqa.com/slider');

  const slider = page.locator('#sliderContainer input[type="range"]');
  const valueLabel = page.locator('#sliderValue');

  // ---------- Move to MIN ----------
  await slider.evaluate(el => {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value'
    ).set;

    setter.call(el, '0');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await expect(slider).toHaveValue('0');

  // Try to go below min using keyboard
  await slider.focus();
  await slider.press('ArrowLeft');
  await slider.press('ArrowLeft');

  const afterMinAttempt = await slider.inputValue();

  // ---------- TC1 ----------
  expect(afterMinAttempt).toBe('0');
  await expect(valueLabel).toHaveValue('0');

  // ---------- Move to MAX ----------
  await slider.evaluate(el => {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value'
    ).set;

    setter.call(el, '100');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await expect(slider).toHaveValue('100');

  // Try to go above max using keyboard
  await slider.press('ArrowRight');
  await slider.press('ArrowRight');

  const afterMaxAttempt = await slider.inputValue();

  // ---------- TC2 ----------
  expect(afterMaxAttempt).toBe('100');
  await expect(valueLabel).toHaveValue('100');
});

test.only('Assignment 8 — Combined Slider Flow', async ({ page }) => {
  await page.goto('https://demoqa.com/slider');

  const slider = page.locator('#sliderContainer input[type="range"]');
  const valueLabel = page.locator('#sliderValue');

  // Helper to safely set slider value
  async function setSlider(value) {
    await slider.evaluate((el, v) => {
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value'
      ).set;

      setter.call(el, v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, String(value));
  }

  // ---------- Step 1: Validate default ----------
  await expect(slider).toHaveValue('25');
  await expect(valueLabel).toHaveValue('25');

  // ---------- Step 2: Drag to specific value (80) ----------
  await setSlider(80);
  await expect(slider).toHaveValue('80');
  await expect(valueLabel).toHaveValue('80');

  // ---------- Step 3: Increase using keyboard ----------
  await slider.focus();
  await slider.press('ArrowRight');
  await slider.press('ArrowRight'); // +2

  let currentValue = Number(await slider.inputValue());
  expect(currentValue).toBe(82);

  // ---------- Step 4: Decrease using keyboard ----------
  await slider.press('ArrowLeft'); // -1

  currentValue = Number(await slider.inputValue());
  expect(currentValue).toBe(81);

  // ---------- Step 5: Move to MIN ----------
  await setSlider(0);
  await expect(slider).toHaveValue('0');
  await expect(valueLabel).toHaveValue('0');

  // ---------- Step 6: Move to MAX ----------
  await setSlider(100);
  await expect(slider).toHaveValue('100');
  await expect(valueLabel).toHaveValue('100');

  // ---------- Final validation ----------
  // TC1: All operations succeeded (no crash if we reached here)
  // TC2: Final state correct
  const finalValue = await slider.inputValue();
  expect(finalValue).toBe('100');
});






// test.only('Result Section Validation', async({page})=>{})