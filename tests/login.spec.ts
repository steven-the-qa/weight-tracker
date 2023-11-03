import { test, expect } from '@playwright/test';

test.afterAll(async ({ browser }) => {
  await browser.close()
})

test.describe('Login', () => {
  test('Login page is loaded', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.content().then(content => console.log(content))
    await expect(page.getByTestId('header-text')).toHaveText('Track your weight loss journey with ease and simplicity');
  })
})