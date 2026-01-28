const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/frames');
})

function toPositiveNumber(value){
    if(!value) return 0;

    const num = parseInt(value);

    if(isNaN(num)) return 0;

    return num;
}

test('Validate Frame 1 Content', async({page})=>{
    const iframe = page.frameLocator("#frame1");
    const frameText = await iframe.locator("#sampleHeading").innerText();
    await expect(frameText).toContain("This is a sample page");
    await expect(page.locator("h1", {hasText : "Frames"})).toBeVisible();
})

test('Validate Frame 2 Content', async({page})=>{
    const iframe = page.frameLocator("#frame2");
    const frameText = await iframe.locator("#sampleHeading").innerText();
    await expect(frameText).toContain("This is a sample page");
    await expect(page.locator("h1", {hasText : "Frames"})).toBeVisible();
})

test('Validate Frames Presence', async({page})=>{
    const frames = page.locator("iframe[id^='frame']");
    const frameCount = await frames.count();
    expect(frameCount).toBe(2);

    const frames1 = page.frames();

for (const frame of frames1) {
  console.log('Frame name:', frame.name());
}
})

test('Evaluate Frame Size', async({page})=>{
    const frame1 = page.locator('#frame1');
    const frame2 = page.locator('#frame2');
    const width1 = await frame1.getAttribute("width");
    const height1 = await frame1.getAttribute("height");
    const width2 = await frame2.getAttribute("width");
    const height2 = await frame2.getAttribute("height");

    const w1 = toPositiveNumber(width1);
    const h1 = toPositiveNumber(height1);
    const w2 = toPositiveNumber(width2);
    const h2 = toPositiveNumber(height2);

    expect(w1).toBeGreaterThan(0);
    expect(h1).toBeGreaterThan(0);
    expect(w2).toBeGreaterThan(0);
    expect(h2).toBeGreaterThan(0);
    
    
})

test('Negative Frame Handling', async ({ page }) => {

  let errorMessage = '';

  try {
    const nonExistentFrame = page.frameLocator('#frame999');

    // Force an action inside the frame to trigger failure
    await nonExistentFrame.locator('#sampleHeading').textContent({ timeout: 3000 });

  } catch (error) {
    errorMessage = error.message;
    console.log('Captured error:', errorMessage);
  }

  expect(errorMessage).toContain('Timeout');
});



// test.only('Result Section Validation', async({page})=>{})