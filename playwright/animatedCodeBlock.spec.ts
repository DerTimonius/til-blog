import test, { expect } from '@playwright/test';

test('animated code block', async ({ page }) => {
  await page.goto('/blog/til-27');

  await expect(page.locator('#animateContainer')).not.toHaveCount(0);
  await expect(
    page.getByText('function recursiveFactorial(num) { // ...}'),
  ).toBeVisible();
});
