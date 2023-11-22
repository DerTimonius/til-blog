import test, { expect } from '@playwright/test';

test('navigate through the blog', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('h1')).toHaveText('Today I learned');
  await expect(page.locator(`[data-test-id^="nav-link"]`)).toHaveCount(4);

  await expect(page.locator(`[data-test-id^="featured-post"]`)).toHaveCount(3);
  await expect(page.locator(`[data-test-id^="latest-post"]`)).toHaveCount(3);

  await page.locator(`[data-test-id="nav-link-blog"]`).click();
  await expect(page).toHaveURL('/blog');
  await expect(page.locator(`[data-test-id^="blog-post"]`)).toHaveCount(5);

  await page.locator(`[data-test-id="blog-post-0"]`).click();
  await expect(page.locator(`[data-test-id="blog-title"]`)).toBeVisible();

  await expect(page.locator(`[data-test-id="tag"]`)).not.toHaveCount(0);
  await page.locator(`[data-test-id="tag"]`).first().click();

  await expect(page).toHaveURL(/\/tags./);
  await expect(page.locator(`[data-test-id^="tag-post"]`)).not.toHaveCount(0);

  await page.locator(`[data-test-id="nav-link-about"]`).click();
  await expect(page).toHaveURL('/about');

  await expect(page.locator(`[data-test-id^="social-link"]`)).toHaveCount(3);
});
