import { test, expect } from '@playwright/test';

test.describe('Vaishnavi Housekeeping — Customer Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for splash screen to finish and home to load
    await page.waitForSelector('text=Good afternoon, Suhaeb', { timeout: 10000 }).catch(async () => {
      await page.waitForSelector('text=Good morning, Suhaeb', { timeout: 5000 });
    });
  });

  test('customer home shows greeting, search, offers, and services', async ({ page }) => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    await expect(page.locator(`text=Good ${greeting}, Suhaeb 👋`)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Banjara Hills, Hyderabad')).toBeVisible();
    await expect(page.getByText('Search for a service')).toBeVisible();
    await expect(page.getByText('Services')).toBeVisible();
    await expect(page.getByText('Offers Running')).toBeVisible();
  });

  test('service cards are scrollable', async ({ page }) => {
    // Use exact button role to avoid matching offer titles that contain the word
    await expect(page.getByRole('button', { name: 'Housekeeping', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Plumbing', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cooking', exact: true })).toBeVisible();
    const scrollContainer = page.locator('.overflow-x-auto').first();
    await expect(scrollContainer).toBeVisible();
  });

  test('offers running section shows promotional cards', async ({ page }) => {
    await expect(page.getByText('Offers Running')).toBeVisible();
    await expect(page.getByText('First Housekeeping Deal')).toBeVisible();
    await expect(page.getByText('Festival Cooking Special')).toBeVisible();
    await expect(page.getByText('Secure Your Home')).toBeVisible();
    await expect(page.getByText('Electrical Checkup')).toBeVisible();
  });

  test('search page shows service grid', async ({ page }) => {
    await page.getByText('Search for a service').click();
    await page.waitForTimeout(300);
    await expect(page.getByPlaceholder(/Search services/i)).toBeVisible();
    await expect(page.getByText('All Services')).toBeVisible();
    await expect(page.locator('.rounded-2xl').filter({ has: page.getByText('Plumbing') })).toBeVisible();
  });

  test('account switcher opens and lists all accounts', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForTimeout(400);
    await expect(page.getByText('Profile')).toBeVisible();
    await page.getByText('Switch Account').click();
    await page.waitForTimeout(400);
    await expect(page.getByText('Switch Experience')).toBeVisible();
    await expect(page.getByText('Suhaeb')).toBeVisible();
    await expect(page.getByText('Vikram Singh')).toBeVisible();
    await expect(page.getByText('Priya Sharma')).toBeVisible();
    await expect(page.getByText('Vaishnavi Ops')).toBeVisible();
    await page.locator('[class*="backdrop-blur"]').first().click({ position: { x: 0, y: 0 } });
    await page.waitForTimeout(300);
  });

  test('profile page shows user stats and menus', async ({ page }) => {
    await page.goto('/profile');
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
    await page.goto('/worker/home');
    await page.waitForTimeout(1000);
  });

  test('worker sees dashboard with stats', async ({ page }) => {
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText("Today's Earnings")).toBeVisible();
    await expect(page.getByText('Rating')).toBeVisible();
    await expect(page.getByText('Pending')).toBeVisible();
  });

  test('worker sees demand by area section', async ({ page }) => {
    await expect(page.getByText('Demand by Area')).toBeVisible();
    await expect(page.getByText('Live')).toBeVisible();
  });

  test('worker can see today schedule', async ({ page }) => {
    await expect(page.getByText("Today's Schedule")).toBeVisible();
  });
});

test.describe('Vaishnavi — Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/dashboard');
    await page.waitForTimeout(1000);
  });

  test('admin sees operations center', async ({ page }) => {
    await expect(page.getByText('Operations Center')).toBeVisible();
    await expect(page.getByText('Vaishnavi Ops')).toBeVisible();
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
    await page.waitForTimeout(1000);
    const hasMap = await page.locator('svg').count();
    const isEmpty = await page.getByText('No active booking found').count();
    await expect(hasMap + isEmpty).toBeGreaterThan(0);
  });
});
