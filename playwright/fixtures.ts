import { test as baseTest } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export * from '@playwright/test';
export const test = baseTest.extend<{}, { workerStorageState: string }>({
  // Use the same storage state for all tests in this worker.
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  // Authenticate once per worker with a worker-scoped fixture.
  workerStorageState: [async ({ browser }, use) => {
    // Use parallelIndex as a unique identifier for each worker.
    const id = test.info().parallelIndex;
    const fileName = path.resolve(test.info().project.outputDir, `.auth/${id}.json`);

    if (fs.existsSync(fileName)) {
      // Reuse existing authentication state if any.
      await use(fileName);
      return;
    }

    // Important: make sure we authenticate in a clean environment by unsetting storage state.
    const page = await browser.newPage({ storageState: undefined });

    // Acquire a unique account, for example create a new one.
    // Alternatively, you can have a list of precreated accounts for testing.
    // Make sure that accounts are unique, so that multiple team members
    // can run tests at the same time without interference.
    const automationTestAccounts = [
        { email: 'User1', password: 'User1'},
        { email: 'User2', password: 'User2'},
        { email: 'User3', password: 'User3'},
        { email: 'User4', password: 'User4'},
    ]
    const workerTestAccount = await automationTestAccounts[id];

    // Perform authentication steps.

    async function trickGoogle() {
        // Click redirects page to Google auth form,
        // parse https://accounts.google.com/ page
        const html = await page.locator('body').innerHTML();

        // Determine type of Google sign in form
        if (html.includes('aria-label="Google"')) {
            // Old Google sign in form
            await page.fill('#Email', workerTestAccount.email);
            await page.locator('#next').click();
            await page.fill('#password', workerTestAccount.password);
            await page.locator('#submit').click();
        } else {
            // New Google sign in form
            await page.fill('input[type="email"]', workerTestAccount.email);
            await page.locator('#identifierNext >> button').click();
            await page.fill('#password >> input[type="password"]', workerTestAccount.password);
            await page.locator('button >> nth=1').click();
        }
    }

    await page.goto('/');
    await page.waitForURL('/login')
    await page.getByTestId('sign_in_with_google').click()
    await trickGoogle()
    // Wait until the page receives the cookies.
    //
    // Sometimes login flow sets cookies in the process of several redirects.
    // Wait for the final URL to ensure that the cookies are actually set.
    await page.waitForURL('/onboarding');

    // End of authentication steps.

    await page.context().storageState({ path: fileName });
    await page.close();
    await use(fileName);
  }, { scope: 'worker' }],
});