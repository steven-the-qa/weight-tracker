import { test, expect, TestInfo } from '@playwright/test';

test.afterEach(async ({page}, testInfo: TestInfo) => {
  await page.screenshot({ path: `${testInfo.project.outputDir}/${testInfo.project.name}-${testInfo.title}.png`})
})

test.afterAll(async ({ browser }) => {
  await browser.close()
})

test.describe('Login', () => {
  test('Login page is loaded', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('header-text')).toHaveText('Track your weight loss journey with ease and simplicity');
  })
})