import { test, expect, Browser, BrowserContext, Page, chromium } from '@playwright/test';

let browser: Browser;
let context: BrowserContext;
let page: Page;

test.beforeAll(async () => {
  // For Debugging Only
  // browser = await chromium.launch({ headless: false });
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();
})

test.describe('Login', async () => {
  test('Login page is loaded', async () => {
    await page.goto('http://localhost:5173/');
    await page.waitForURL('http://localhost:5173/login')
    await expect(page.getByTestId('header-text')).toHaveText('Track your weight loss journey with ease and simplicity');
  })
})