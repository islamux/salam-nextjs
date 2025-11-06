import { test, expect } from '@playwright/test';

test.describe('Chapter Page', () => {
  test('should load chapter 1', async ({ page }) => {
    await page.goto('/elm/1');
    await expect(page.locator('h1')).toContainText('الفصل 1');
    await expect(page.locator('[data-testid="chapter-content"]')).toBeVisible();
  });

  test('should display chapter content', async ({ page }) => {
    await page.goto('/elm/1');

    // Should have some content
    const content = page.locator('[data-testid="chapter-content"]');
    await expect(content).toContainText(/.*/);
  });

  test('should navigate to next chapter', async ({ page }) => {
    await page.goto('/elm/1');

    // Click next chapter button
    await page.click('[data-testid="next-chapter"]');

    // Should navigate to chapter 2
    await expect(page).toHaveURL('/elm/2');
    await expect(page.locator('h1')).toContainText('الفصل 2');
  });

  test('should navigate to previous chapter', async ({ page }) => {
    await page.goto('/elm/2');

    // Click previous chapter button
    await page.click('[data-testid="previous-chapter"]');

    // Should navigate to chapter 1
    await expect(page).toHaveURL('/elm/1');
    await expect(page.locator('h1')).toContainText('الفصل 1');
  });

  test('should have progress indicator', async ({ page }) => {
    await page.goto('/elm/1');

    // Progress indicator should be visible
    const progress = page.locator('[data-testid="progress-indicator"]');
    await expect(progress).toBeVisible();

    // Should show "1 من 29"
    await expect(progress).toContainText('1 من 29');
  });

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/elm/1');

    // Content should still be visible
    await expect(page.locator('h1')).toContainText('الفصل 1');
    await expect(page.locator('[data-testid="chapter-content"]')).toBeVisible();
  });
});
