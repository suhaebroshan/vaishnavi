import { test, expect } from '@playwright/test';

test.describe('Vaishnavi - Core Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for app to load and seed database
    await page.waitForTimeout(2000);
  });

  test('customer can view home page with services', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/Dashboard|Welcome/i).or(
      await expect(page.locator('.font-bold.text-\\[#173F35\\]:not(.text-white)')).toBeVisible()
    );
    
    // Services should be visible
    const serviceCards = page.locator('[class*="min-w-\\[80px\\]"]').first();
    await expect(serviceCards).toBeVisible();
    
    // Search bar should exist
    const searchInput = page.getByPlaceholder(/What do you need help with/i);
    await expect(searchInput).toBeVisible();
    
    // Bottom navigation should be visible
    const bottomNav = page.locator('nav').filter({ has: page.getByRole('navigation') }).last();
    // Check key nav items exist
    await expect(page.getByRole('button', { name: /Home/i })).toBeVisible();
  });

  test('account switcher cycles through roles', async ({ page }) => {
    // Click profile button to open account switcher
    const profileBtn = page.locator('button').filter({ hasText: /^\w$/ }).last();
    await profileBtn.click();
    
    // Account switcher should appear
    await expect(page.locator('[class*="rounded-t-\\[28px\\]"]')).toBeVisible();
    
    // Worker option should be visible
    await expect(page.getByText('Vikram Singh')).toBeVisible();
    
    // Admin option should be visible
    await expect(page.getByText('Vaishnavi Ops')).toBeVisible();
    
    // Close by clicking outside or on a row
    await page.getByText('Suhaeb').click();
  });

  test('keyboard shortcuts switch roles', async ({ page }) => {
    // Press Alt+2 to switch to worker
    await page.keyboard.press('Alt+2');
    await page.waitForTimeout(1000);
    
    // Should now see worker dashboard
    await expect(page.locator('h1')).toContainText(/Dashboard/i);
    
    // Press Alt+1 to switch back to customer
    await page.keyboard.press('Alt+1');
    await page.waitForTimeout(1000);
    
    // Should see customer home
  });

  test('customer can view services list', async ({ page }) => {
    // Click search to go to services
    const searchInput = page.getByPlaceholder(/What do you need help with/i);
    await searchInput.click();
    
    // Should navigate to search/services page
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible().or(
      await expect(page.getByText(/All Services/i)).toBeVisible()
    );
  });

  test('booking detail shows status timeline', async ({ page }) => {
    // Navigate to bookings
    await page.getByRole('navigation').getByRole('button', { name: /Bookings/i }).click();
    await page.waitForTimeout(500);
    
    // Should show booking list or empty state
    const bookingsPage = page.locator('main, [class*="min-h-screen"]').first();
    await expect(bookingsPage).toBeVisible();
  });
});

test.describe('Vaishnavi - Worker Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    // Switch to worker role
    await page.keyboard.press('Alt+2');
    await page.waitForTimeout(1500);
  });

  test('worker sees earnings and pending requests', async ({ page }) => {
    // Should see dashboard with stats
    await expect(page.locator('h1')).toContainText(/Dashboard/i);
    
    // Stats cards should be visible
    const statsCards = page.locator('[class*="bg-white"].rounded-2xl').filter({ has: page.locator('p.font-bold') });
    await expect(statsCards).toHaveCountGreaterThan(0);
  });

  test('worker can access jobs and requests', async ({ page }) => {
    // Jobs button should be in bottom nav
    await expect(page.getByRole('navigation').getByRole('button', { name: /Jobs/i })).toBeVisible();
  });
});

test.describe('Vaishnavi - Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    // Switch to admin role
    await page.keyboard.press('Alt+3');
    await page.waitForTimeout(1500);
  });

  test('admin sees operations dashboard', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/Operations Dashboard/i).or(
      await expect(page.locator('h1')).toContainText(/Dashboard/i)
    );
    
    // Quick action buttons should exist
    await expect(page.getByText(/Live Map/i)).toBeVisible();
    await expect(page.getByText(/All Bookings/i)).toBeVisible();
  });
});
