const { test, expect } = require('@playwright/test');

test.describe('Broken Links and Images - DemoQA', () => {

  test('Detect broken links and images', async ({ page }) => {

    // 1. Navigate to the page
    await page.goto('https://demoqa.com/broken');

    // =============================
    // 🔗 CHECK BROKEN LINKS
    // =============================
    const links = await page.locator('a').all();
    console.log(`Total Links Found: ${links.length}`);

    const brokenLinks = [];

    for (const link of links) {
      const href = await link.getAttribute('href');

      if (!href || href.startsWith('#')) continue;

      try {
        const response = await page.request.get(href);

        if (!response.ok()) {
          brokenLinks.push(`${href} → ${response.status()}`);
        }
      } catch (error) {
        brokenLinks.push(`${href} → Fetch Error`);
      }
    }

    console.log('🔗 Broken Links:', brokenLinks);

    // =============================
    // 🖼️ CHECK BROKEN IMAGES
    // =============================
    const images = await page.locator('img').all();
    console.log(`Total Images Found: ${images.length}`);

    const brokenImages = [];

    for (const img of images) {
      const src = await img.getAttribute('src');

      if (!src) continue;

      // 1️⃣ Network check
      try {
        const imgResponse = await page.request.get(src);

        if (!imgResponse.ok()) {
          brokenImages.push(`${src} → Status ${imgResponse.status()}`);
          continue;
        }
      } catch (error) {
        brokenImages.push(`${src} → Fetch Error`);
        continue;
      }

      // 2️⃣ UI rendering check
      const isLoaded = await img.evaluate(el =>
        el.complete && el.naturalWidth > 0
      );

      if (!isLoaded) {
        brokenImages.push(`${src} → Render Failed`);
      }
    }

    console.log('🖼️ Broken Images:', brokenImages);

    // =============================
    // ✅ FINAL ASSERTIONS
    // =============================
    expect(brokenLinks.length, 'Broken links found').toBe(1);
    expect(brokenImages.length, 'Broken images found').toBe(4);

  });

});
