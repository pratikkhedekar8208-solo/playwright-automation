// @ts-check
import { chromium, defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config =({
  testDir: './tests',
  timeout : 30 * 1000,
  expect : {
    timeout : 12000,
  },
  reporter : 'html',

  use: {
    browserName : 'chromium',
    headless : false,
    video: 'retain-on-failure'
  },
});
module.exports = config

