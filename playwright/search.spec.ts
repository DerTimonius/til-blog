import test, { expect } from '@playwright/test';

test('search functionality', async ({ page }) => {
  await page.goto('/');

  await page.locator(`[data-test-id="nav-link-search"]`).click();
  await expect(page).toHaveURL('/search');

  await page.locator('input').fill('javascript');
  await expect(page.locator(`[data-test-id^="search-result"]`)).not.toHaveCount(
    0,
  );
  await page.locator('h2').first().click();

  await expect(page).toHaveURL(/\/blog\/.+/);
});
