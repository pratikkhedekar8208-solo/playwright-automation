const { test, expect } = require("@playwright/test");

// test.beforeEach(async ({ page }) => {
//     await page.goto('https://demoqa.com/radio-button');
// })

test('Assignment 1 — Select and Validate Simple Date', async ({ page }) => {
  await page.goto('https://demoqa.com/date-picker');

  const dateInput = page.locator('#datePickerMonthYearInput');

  // ---------- TC1: Calendar opens ----------
  await dateInput.click();
  const calendar = page.locator('.react-datepicker');
  await expect(calendar).toBeVisible();

  // ---------- Select April 15, 2026 ----------

  // Select year
  await page.locator('.react-datepicker__year-select').selectOption('2026');

  // Select month (0 = Jan, 3 = April)
  await page.locator('.react-datepicker__month-select').selectOption('3');

  // Select day 15 (avoid days from other months)
  await page.locator(
    '.react-datepicker__day--015:not(.react-datepicker__day--outside-month)'
  ).click();

  // ---------- TC2 + TC3: Validate value & format ----------
  const expectedDate = '04/15/2026';
  await expect(dateInput).toHaveValue(expectedDate);
});

test('Assignment 2 — Select Date via Keyboard', async ({ page }) => {
  await page.goto('https://demoqa.com/date-picker');

  const dateInput = page.locator('#datePickerMonthYearInput');

  // Focus input
  await dateInput.click();

  // Clear existing value (Ctrl+A → Backspace)
  await dateInput.press('Control+A');
  await dateInput.press('Backspace');

  // Type date manually (DD-MM-YYYY style input intention)
  await dateInput.fill('2025-04-12');

  // Press Enter to let control format it
  await dateInput.press('Enter');

  // ---------- TC1 + TC2 ----------
  // DemoQA formats as MM/DD/YYYY
  const expectedFormattedDate = '04/12/2025';
  await expect(dateInput).toHaveValue(expectedFormattedDate);
});

test('Assignment 3 — Validate Date Format', async ({ page }) => {
  await page.goto('https://demoqa.com/date-picker');

  // ---------- Select Date field ----------
  const dateInput = page.locator('#datePickerMonthYearInput');

  await dateInput.click();

  // Select a date (April 15, 2026)
  await page.locator('.react-datepicker__year-select').selectOption('2026');
  await page.locator('.react-datepicker__month-select').selectOption('3'); // April
  await page.locator('.react-datepicker__day--015:not(.react-datepicker__day--outside-month)').click();

  const dateValue = await dateInput.inputValue();

  // TC1: Validate MM/DD/YYYY format
  expect(dateValue).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);

  // ---------- Date and Time Picker ----------
  const dateTimeInput = page.locator('#dateAndTimePickerInput');

  await dateTimeInput.click();

  // Select any day
  await page.locator('.react-datepicker__day--020:not(.react-datepicker__day--outside-month)').click();

  // Select a time (e.g., 10:00)
  await page.locator('.react-datepicker__time-list-item', { hasText: '10:00' }).click();

  const dateTimeValue = await dateTimeInput.inputValue();

  // TC2: Validate date + time format
  // Example: 04/20/2026 10:00 AM
expect(dateTimeValue).toMatch(/^[A-Za-z]+ \d{1,2}, \d{4} \d{1,2}:\d{2} (AM|PM)$/);
});

test('Assignment 4 — Date & Time Picker Interaction', async ({ page }) => {
  await page.goto('https://demoqa.com/date-picker');

  const dateTimeInput = page.locator('#dateAndTimePickerInput');

  // ---------- Open Date & Time Picker ----------
  await dateTimeInput.click();

  // TC1: Validate time list is visible
  const timeList = page.locator('.react-datepicker__time-list');
  await expect(timeList).toBeVisible();

  // ---------- Select Month & Year ----------
  // Example: April 2026
  await page.locator('.react-datepicker__month-read-view').click();
  await page.locator('.react-datepicker__month-option', { hasText: 'April' }).click();

  await page.locator('.react-datepicker__year-read-view').click();
  await page.locator('.react-datepicker__year-option', { hasText: '2026' }).click();

  // ---------- Select Day ----------
  await page.locator(
    '.react-datepicker__day--015:not(.react-datepicker__day--outside-month)'
  ).click();

  // ---------- Select Time ----------
  await page.locator('.react-datepicker__time-list-item', { hasText: '10:00' }).click();

  // ---------- TC2: Validate input value updated ----------
  const value = await dateTimeInput.inputValue();

  // Example format: "April 15, 2026 10:00 AM"
  expect(value).toMatch(/^[A-Za-z]+ \d{1,2}, \d{4} \d{1,2}:\d{2} (AM|PM)$/);
});

test('Assignment 5 — Future Date Validation', async ({ page }) => {
  await page.goto('https://demoqa.com/date-picker');

  const dateInput = page.locator('#datePickerMonthYearInput');

  // ---------- Calculate future date (+1 year) ----------
  const today = new Date();
  const future = new Date(today);
  future.setFullYear(today.getFullYear() + 1);

  const futureMonth = future.getMonth();        // 0–11
  const futureYear = future.getFullYear();      // e.g., 2027
  const futureDay = future.getDate();           // 1–31

  // Format for assertion: MM/DD/YYYY
  const expectedValue =
    String(futureMonth + 1).padStart(2, '0') +
    '/' +
    String(futureDay).padStart(2, '0') +
    '/' +
    futureYear;

  // ---------- Open calendar ----------
  await dateInput.click();

  // ---------- Select future year ----------
  await page.locator('.react-datepicker__year-select').selectOption(String(futureYear));

  // ---------- Select future month ----------
  await page.locator('.react-datepicker__month-select').selectOption(String(futureMonth));

  // ---------- Select future day ----------
  const daySelector = `.react-datepicker__day--${String(futureDay).padStart(3, '0')}:not(.react-datepicker__day--outside-month)`;
  await page.locator(daySelector).click();

  // ---------- Validations ----------
  // TC1: Date was selectable (calendar interaction succeeded)
  await expect(dateInput).not.toHaveValue('');

  // TC2: Correct future date stored
  await expect(dateInput).toHaveValue(expectedValue);
});

test('Assignment 6 — Past Date Validation', async ({ page }) => {
  await page.goto('https://demoqa.com/date-picker');

  const dateInput = page.locator('#datePickerMonthYearInput');

  // ---------- Calculate yesterday ----------
  const today = new Date();
  const past = new Date(today);
  past.setDate(today.getDate() - 1);

  const pastMonth = past.getMonth();      // 0–11
  const pastYear = past.getFullYear();    // e.g., 2025
  const pastDay = past.getDate();         // 1–31

  // Format expected value: MM/DD/YYYY
  const expectedValue =
    String(pastMonth + 1).padStart(2, '0') +
    '/' +
    String(pastDay).padStart(2, '0') +
    '/' +
    pastYear;

  // ---------- Open calendar ----------
  await dateInput.click();

  // ---------- Navigate to past year ----------
  await page.locator('.react-datepicker__year-select')
            .selectOption(String(pastYear));

  // ---------- Navigate to past month ----------
  await page.locator('.react-datepicker__month-select')
            .selectOption(String(pastMonth));

  // ---------- Select past day ----------
  const daySelector =
    `.react-datepicker__day--${String(pastDay).padStart(3, '0')}:not(.react-datepicker__day--outside-month)`;

  await page.locator(daySelector).click();

  // ---------- Validations ----------
  // TC1: Past date reachable
  await expect(dateInput).not.toHaveValue('');

  // TC2: Input accepts correct past date
  await expect(dateInput).toHaveValue(expectedValue);
});

test('Assignment 7 — UI Stability After Date Change', async ({ page }) => {
  const jsErrors = [];
  page.on('pageerror', e => jsErrors.push(e.message));

  await page.goto('https://demoqa.com/date-picker');

  // ---------- Select Date picker ----------
  const dateInput = page.locator('#datePickerMonthYearInput');
  await dateInput.click();
  await page.locator('.react-datepicker__day--010:not(.react-datepicker__day--outside-month)').click();

  // ---------- Date & Time picker ----------
  const dateTimeInput = page.locator('#dateAndTimePickerInput');
  await dateTimeInput.click();
  await page.locator('.react-datepicker__day--020:not(.react-datepicker__day--outside-month)').click();
  await page.locator('.react-datepicker__time-list-item', { hasText: '10:00' }).click();

  // ---------- Click outside ----------
  await page.locator('h1').click();

  // ---------- TC1: Page doesn’t crash ----------
  expect(jsErrors.filter(e => !e.includes('setup is not a function'))).toHaveLength(0);

  // ---------- TC2: Elements clickable ----------
  await dateInput.click();
  await expect(page.locator('.react-datepicker')).toBeVisible();

  await dateTimeInput.click();
  await expect(page.locator('.react-datepicker__time-list')).toBeVisible();
});

test.only('Assignment 8 — Negative / Invalid Input Handling', async ({ page }) => {
  await page.goto('https://demoqa.com/date-picker');

  const dateInput = page.locator('#datePickerMonthYearInput');

  // ---------- Focus & clear ----------
  await dateInput.click();
  await dateInput.press('Control+A');
  await dateInput.press('Backspace');

  // ---------- Enter invalid date ----------
  const invalidDate = '99/99/9999';
  await dateInput.type(invalidDate);
  await dateInput.press('Enter');

  // ---------- TC1: Control does not crash ----------
  await expect(dateInput).toBeVisible();
  await expect(dateInput).toBeEnabled();

  // ---------- TC2: Input handled safely ----------
  const finalValue = await dateInput.inputValue();

  // Either empty OR corrected to a valid date OR unchanged but UI stable
  expect(
    finalValue === '' ||
    finalValue !== invalidDate
  ).toBeTruthy();
});







// test.only('Result Section Validation', async({page})=>{})