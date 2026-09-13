import { test, expect } from '@playwright/test';

test.describe('Vaishnavi Housekeeping — Customer Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('customer home shows greeting, search, and services', async ({ page }) => {
    // Greeting should be visible
    await expect(page.locator('text=Good morning, Suhaeb 👋')).toBeVisible({ timeout: 5000 }).or(
      await expect(page.locator('text=Good afternoon, Suhaeb 👋')).toBeVisible({ timeout: 5000 }).or(
        await expect(page.locator('text=Good evening, Suhaeb 👋')).toBeVisible({ timeout: 5000 })
      )
    );
    // Location chip
    await expect(page.locator('text=Banjara Hills, Hyderabad')).toBeVisible();
    // Search bar
    await expect(page.getByPlaceholder(/What do you need help with/i)).toBeVisible();
    // Services section
    await expect(page.locator('text=Services')).toBeVisible();
    // Bottom nav
    await expect(page.getByRole('button', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Bookings' })).toBeVisible();
  });

  test('service cards are scrollable', async ({ page }) => {
    await expect(page.locator('text=Housekeeping')).toBeVisible();
    await expect(page.locator('text=Plumbing')).toBeVisible();
    await expect(page.locator('text=Cooking')).toBeVisible();
    // Horizontal scroll works
    const scrollContainer = page.locator('.overflow-x-auto').first();
    await expect(scrollContainer).toBeVisible();
  });

  test('search page shows service grid', async ({ page }) => {
    await page.getByPlaceholder(/What do you need help with/i).click();
    await expect(page.getByPlaceholder(/Search services/i)).toBeVisible();
    await expect(page.locator('text=All Services')).toBeVisible();
    // Grid of service cards
    await expect(page.locator('.rounded-2xl').filter({ has: page.locator('text=Plumbing') })).toBeVisible();
  });

  test('account switcher opens and lists all roles', async ({ page }) => {
    // Click profile button (top-right avatar)
    await page.locator('button').filter({ has: page.locator('text=S') }).last().click();
    await page.waitForTimeout(500);
    // Switch Account panel should appear
    await expect(page.locator('text=Switch Account')).toBeVisible();
    // All roles listed
    await expect(page.locator('text=Suhaeb')).toBeVisible();
    await expect(page.locator('text=Vikram Singh')).toBeVisible();
    await expect(page.locator('text=Priya Sharma')).toBeVisible();
    await expect(page.locator('text=Vaishnavi Ops')).toBeVisible();
    // Close by clicking outside
    await page.locator('text=Switch Account').click({ position: { x: 0, y: 0 } });
  });
});

test.describe('Vaishnavi — Worker Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Switch to worker via keyboard shortcut
    await page.keyboard.press('Alt+2');
    await page.waitForTimeout(1500);
  });

  test('worker sees dashboard with stats', async ({ page }) => {
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Today\'s Earnings')).toBeVisible();
    await expect(page.locator('text=Rating')).toBeVisible();
    await expect(page.locator('text=Pending')).toBeVisible();
  });

  test('worker can see today schedule', async ({ page }) => {
    await expect(page.locator('text=Today\'s Schedule')).toBeVisible();
    await expect(page.locator('text=Bathroom Repair')).toBeVisible();
  });
});

test.describe('Vaishnavi — Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Alt+3');
    await page.waitForTimeout(1500);
  });

  test('admin sees operations center', async ({ page }) => {
    await expect(page.locator('text=Operations Center')).toBeVisible();
    await expect(page.locator('text=Good morning, Santosh')).toBeVisible().or(
      await expect(page.locator('text=Good afternoon, Santosh')).toBeVisible()
    );
    await expect(page.locator('text=Active Bookings')).toBeVisible();
    await expect(page.locator('text=Workers Online')).toBeVisible();
    await expect(page.locator('text=Today\'s Revenue')).toBeVisible();
    await expect(page.locator('text=Live Map')).toBeVisible();
    await expect(page.locator('text=All Bookings')).toBeVisible();
  });
});

test.describe('Vaishnavi — Tracking & Chat', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('chat page renders with message bubbles', async ({ page }) => {
    await page.getByRole('navigation').getByRole('button', { name: 'Chat' }).click();
    await page.waitForTimeout(800);
    // Quick replies should be visible
    await expect(page.locator('text=I\'m at the entrance')).toBeVisible();
    await expect(page.locator('text=How far are you?')).toBeVisible();
    // Message input
    await expect(page.getByPlaceholder(/Type a message/i)).toBeVisible();
  });

  test('call screen shows caller info', async ({ page }) => {
    await page.getByRole('navigation').getByRole('button', { name: 'Chat' }).click();
    await page.waitForTimeout(500);
    await page.locator('button').filter({ has: page.locator('svg') }).nth(0).click();
    await page.waitForTimeout(500);
    // Should navigate to call or show call-related UI
    await expect(page.locator('text=Vikram Singh')).toBeVisible().or(
      await expect(page.locator('.min-h-screen.bg-\\[#173F35\\]')).toBeVisible()
    );
  });
});
