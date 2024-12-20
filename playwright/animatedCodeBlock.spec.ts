import test, { expect } from '@playwright/test';

test('animated code block', async ({ page }) => {
  await page.goto('/posts/til-27');

  await expect(page.locator('#animateContainer')).not.toHaveCount(0);
  await expect(
    page.getByText('recursiveFactorial', { exact: true }),
  ).toBeVisible();
});
