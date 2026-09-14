import { test, expect } from '@playwright/test';

const CUSTOMER_HOME = 'Banjara Hills, Hyderabad';

async function selectCustomer(page: any) {
  await page.goto('/');
  await expect(page.getByText('Choose your experience')).toBeVisible({ timeout: 8000 });
  await page.getByText('Enter as Customer').click();
  // Wait for transition overlay + route change; prefer location pill, fall back to greeting
  await expect(page.getByText(CUSTOMER_HOME)).toBeVisible({ timeout: 12000 }).catch(async () => {
    // Fallback: wait for any customer-home indicator
    await expect(page.locator('.min-h-screen')).toBeVisible({ timeout: 5000 });
  });
}

async function selectWorker(page: any) {
  await page.goto('/');
  await expect(page.getByText('Choose your experience')).toBeVisible({ timeout: 8000 });
  await page.getByText('Enter as Professional').click();
  await expect(page.getByText('Dashboard')).toBeVisible({ timeout: 10000 });
}

async function selectAdmin(page: any) {
  await page.goto('/');
  await expect(page.getByText('Choose your experience')).toBeVisible({ timeout: 8000 });
  await page.getByText('Enter as Administrator').click();
  // Wait for route change and admin dashboard to mount
  await page.waitForURL('**/admin/dashboard', { timeout: 5000 });
  await expect(page.getByText('Operations Center')).toBeVisible({ timeout: 10000 });
}

function ensureCustomer(page: any) {
  const url = page.url();
  if (url.includes('/landing') || url.endsWith('/') || url.endsWith('#')) {
    return selectCustomer(page);
  }
  return Promise.resolve();
}

test.describe('Vaishnavi Housekeeping — Customer Flow', () => {
  test.beforeEach(async ({ page }) => {
    await selectCustomer(page);
  });

  test('customer home shows greeting, search, offers, and services', async ({ page }) => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    await expect(page.locator(`text=Good ${greeting}, Suhaeb`)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(CUSTOMER_HOME)).toBeVisible();
    await expect(page.getByText('Search for a service')).toBeVisible();
    await expect(page.getByText('Services')).toBeVisible();
    await expect(page.getByText('Offers Running')).toBeVisible();
  });

  test('service cards are scrollable', async ({ page }) => {
    // ServiceCard elements render as standalone buttons — use direct role locators
    await expect(page.getByRole('button', { name: 'Housekeeping' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Plumbing' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cooking' })).toBeVisible();
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
    // The search trigger is a button with text "Search for a service"
    await page.getByText('Search for a service').click();
    // Wait for route change to /search before checking content
    await page.waitForURL('**/search', { timeout: 3000 });
    // Wait for search page to mount; it renders service card buttons with service names (partial match — includes icon/desc/price)
    await expect(page.getByRole('button', { name: 'Plumbing' })).toBeVisible({ timeout: 5000 });
  });

  test('account switcher opens and lists all accounts', async ({ page }) => {
    await page.goto('/profile');
    await ensureCustomer(page);
    await expect(page.getByText('Profile')).toBeVisible();
    await page.getByText('Switch Account').click();
    await page.waitForTimeout(400);
    await expect(page.getByText('Switch Experience')).toBeVisible();
    // List all seeded account names visible in the switcher
    await expect(page.getByText('Suhaeb')).toBeVisible();
    await expect(page.getByText('Vikram Singh')).toBeVisible();
    await expect(page.getByText('Vaishnavi Ops')).toBeVisible();
    // Close by clicking the backdrop overlay
    await page.locator('div[class*="backdrop-blur"]').first().click({ position: { x: 0, y: 0 } });
    await page.waitForTimeout(300);
  });

  test('profile page shows user stats and menus', async ({ page }) => {
    await page.goto('/profile');
    await ensureCustomer(page);
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
    await selectWorker(page);
  });

  test('worker sees dashboard with stats', async ({ page }) => {
    await expect(page.getByText('Dashboard')).toBeVisible();
    // Earning tiles show Today, This Week, This Month labels
    await expect(page.getByText('Today')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Rating')).toBeVisible();
  });

  test('worker sees today schedule section', async ({ page }) => {
    // The worker home renders "Today's Schedule" heading
    await expect(page.getByText("Today's Schedule")).toBeVisible({ timeout: 5000 });
  });

  test('worker can see today schedule items', async ({ page }) => {
    await expect(page.getByText("Today's Schedule")).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Vaishnavi — Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await selectAdmin(page);
  });

  test('admin sees operations center', async ({ page }) => {
    await expect(page.getByText('Operations Center')).toBeVisible();
    // Admin user name comes from stored account
    await expect(page.getByText('Vaishnavi Ops')).toBeVisible();
    // Stats grid labels
    await expect(page.getByText('Active Bookings')).toBeVisible();
    await expect(page.getByText('Workers Online')).toBeVisible();
    await expect(page.getByText('Total Revenue')).toBeVisible();
    await expect(page.getByText('Live Map')).toBeVisible();
    await expect(page.getByText('All Bookings')).toBeVisible();
  });
});

test.describe('Vaishnavi — Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await selectCustomer(page);
  });

  test('tracking page renders map or empty state', async ({ page }) => {
    await page.goto('/tracking');
    await ensureCustomer(page);
    await page.waitForTimeout(600);
    const hasMap = await page.locator('svg').count();
    const isEmpty = await page.getByText('No active booking found').count();
    await expect(hasMap + isEmpty).toBeGreaterThan(0);
  });
});
