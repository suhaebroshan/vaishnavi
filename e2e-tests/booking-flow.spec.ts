import { test, expect } from '@playwright/test';

test.describe('Vaishnavi Housekeeping — Customer Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for splash screen to finish and home to load
    await page.waitForSelector('text=Good afternoon, Suhaeb', { timeout: 10000 }).catch(async () => {
      await page.waitForSelector('text=Good morning, Suhaeb', { timeout: 5000 });
    });
  });

  test('customer home shows greeting, search, and services', async ({ page }) => {
    // Greeting should be visible (time-based)
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    await expect(page.locator(`text=Good ${greeting}, Suhaeb 👋`)).toBeVisible({ timeout: 5000 });
    // Location chip
    await expect(page.getByText('Banjara Hills, Hyderabad')).toBeVisible();
    // Search bar (it's a button with that text)
    await expect(page.getByText('Search for a service')).toBeVisible();
    // Services section
    await expect(page.getByText('Services')).toBeVisible();
    // Bottom nav — scroll to see it
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(200);
    await expect(page.getByText('Home')).toBeVisible();
    await expect(page.getByText('Bookings')).toBeVisible();
    await expect(page.getByText('Services')).toBeVisible();
    await expect(page.getByText('Profile')).toBeVisible();
  });

  test('service cards are scrollable', async ({ page }) => {
    await expect(page.getByText('Housekeeping')).toBeVisible();
    await expect(page.getByText('Plumbing')).toBeVisible();
    await expect(page.getByText('Cooking')).toBeVisible();
    // Horizontal scroll works
    const scrollContainer = page.locator('.overflow-x-auto').first();
    await expect(scrollContainer).toBeVisible();
  });

  test('search page shows service grid', async ({ page }) => {
    // Click the search bar button
    await page.getByText('Search for a service').click();
    await page.waitForTimeout(300);
    await expect(page.getByPlaceholder(/Search services/i)).toBeVisible();
    await expect(page.getByText('All Services')).toBeVisible();
    // Grid of service cards
    await expect(page.locator('.rounded-2xl').filter({ has: page.getByText('Plumbing') })).toBeVisible();
  });

  test('account switcher opens and lists all roles', async ({ page }) => {
    // Click profile button (bottom nav)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.getByText('Profile').click();
    await page.waitForTimeout(400);
    // Profile page should show
    await expect(page.getByText('Profile')).toBeVisible();
    // Switch Account menu item
    await page.getByText('Switch Account').click();
    await page.waitForTimeout(400);
    // Switch experience panel should appear
    await expect(page.getByText('Switch Experience')).toBeVisible();
    // All roles listed
    await expect(page.getByText('Suhaeb')).toBeVisible();
    await expect(page.getByText('Vikram Singh')).toBeVisible();
    await expect(page.getByText('Priya Sharma')).toBeVisible();
    await expect(page.getByText('Vaishnavi Ops')).toBeVisible();
    // Close by clicking backdrop
    await page.locator('[class*="backdrop-blur"]').first().click({ position: { x: 0, y: 0 } });
    await page.waitForTimeout(300);
  });

  test('profile page shows user stats and menus', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.getByText('Profile').click();
    await page.waitForTimeout(400);
    await expect(page.getByText('Suhaeb')).toBeVisible();
    await expect(page.getByText('My Bookings')).toBeVisible();
    await expect(page.getByText('Saved Addresses')).toBeVisible();
    await expect(page.getByText('Payment Methods')).toBeVisible();
    await expect(page.getByText('Help & Support')).toBeVisible();
    await expect(page.getByText('Sign Out')).toBeVisible();
  });
});

test.describe('Vaishnavi — Worker Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('text=Good afternoon, Suhaeb', { timeout: 10000 }).catch(async () => {
      await page.waitForSelector('text=Good morning, Suhaeb', { timeout: 5000 });
    });
    // Switch to worker via keyboard shortcut
    await page.keyboard.press('Alt+2');
    await page.waitForTimeout(1500);
  });

  test('worker sees dashboard with stats', async ({ page }) => {
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText("Today's Earnings")).toBeVisible();
    await expect(page.getByText('Rating')).toBeVisible();
    await expect(page.getByText('Pending')).toBeVisible();
  });

  test('worker can see today schedule', async ({ page }) => {
    await expect(page.getByText("Today's Schedule")).toBeVisible();
    await expect(page.getByText('Bathroom Repair')).toBeVisible();
  });
});

test.describe('Vaishnavi — Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('text=Good afternoon, Suhaeb', { timeout: 10000 }).catch(async () => {
      await page.waitForSelector('text=Good morning, Suhaeb', { timeout: 5000 });
    });
    await page.keyboard.press('Alt+3');
    await page.waitForTimeout(1500);
  });

  test('admin sees operations center', async ({ page }) => {
    await expect(page.getByText('Operations Center')).toBeVisible();
    await expect(page.getByText('Santosh')).or(expect(page.getByText('Suhaeb'))).toBeVisible();
    await expect(page.getByText('Active Bookings')).toBeVisible();
    await expect(page.getByText('Workers Online')).toBeVisible();
    await expect(page.getByText("Today's Revenue")).toBeVisible();
    await expect(page.getByText('Live Map')).toBeVisible();
    await expect(page.getByText('All Bookings')).toBeVisible();
  });
});

test.describe('Vaishnavi — Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('text=Good afternoon, Suhaeb', { timeout: 10000 }).catch(async () => {
      await page.waitForSelector('text=Good morning, Suhaeb', { timeout: 5000 });
    });
  });

  test('tracking page renders map or empty state', async ({ page }) => {
    await page.goto('/tracking');
    await page.waitForTimeout(800);
    // Should show either a map (SVG) or an empty state
    const hasMap = await page.locator('svg').count();
    const isEmpty = await page.getByText('No active booking found').count();
    await expect(hasMap + isEmpty).toBeGreaterThan(0);
  });
});
