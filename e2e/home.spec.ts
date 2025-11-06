import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load home page successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/علم/);
  });

  test('should display all 29 chapters', async ({ page }) => {
    await page.goto('/');

    // Wait for chapters to load
    await page.waitForSelector('text=الفصل 1');
    await page.waitForSelector('text=الفصل 29');

    // Check if chapter cards are present
    const chapterCards = page.locator('a[href^="/elm/"]');
    await expect(chapterCards).toHaveCount(29);
  });

  test('should navigate to chapter 1', async ({ page }) => {
    await page.goto('/');

    // Click on first chapter
    await page.click('a[href="/elm/1"]');

    // Should navigate to chapter 1 page
    await expect(page).toHaveURL('/elm/1');
    await expect(page.locator('h1')).toContainText('الفصل 1');
  });

  test('should navigate to search page', async ({ page }) => {
    await page.goto('/');

    // Click search button
    await page.click('a[href="/search"]');

    // Should navigate to search page
    await expect(page).toHaveURL('/search');
    await expect(page.locator('h1')).toContainText('بحث في المحتوى');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // Check if grid is responsive
    const chapterCards = page.locator('a[href^="/elm/"]');
    await expect(chapterCards.first()).toBeVisible();
  });

  test('should have proper Arabic RTL layout', async ({ page }) => {
    await page.goto('/');

    // Check html lang and dir attributes
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });
});
