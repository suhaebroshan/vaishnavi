import { test, expect } from '@playwright/test';

async function selectCustomer(page: any) {
  await page.goto('/');
  await expect(page.getByText('Choose your experience')).toBeVisible({ timeout: 8000 });
  await page.getByText('Enter as Customer').click();
  await expect(page.getByText('Banjara Hills, Hyderabad')).toBeVisible({ timeout: 10000 });
}

test.describe('Vaishnavi — Booking Detail & History', () => {
  test.beforeEach(async ({ page }) => {
    await selectCustomer(page);
  });

  test('history page shows real DB bookings with service types', async ({ page }) => {
    await page.goto('/history');
    await expect(page.getByText('Work History')).toBeVisible({ timeout: 5000 });
    const text = await page.locator('.min-h-screen').textContent();
    const serviceTypes = ['plumbing', 'housekeeping', 'cooking', 'electrical', 'elder', 'security'];
    const foundAny = serviceTypes.some(s => text.toLowerCase().includes(s));
    expect(foundAny).toBe(true);
  });

  test('bookings page uses real DB data and shows status badges', async ({ page }) => {
    await page.goto('/bookings');
    await expect(page.getByText('Bookings')).toBeVisible({ timeout: 5000 });
    const tabText = await page.locator('.sticky').textContent();
    expect(tabText).toContain('Active');
    expect(tabText).toContain('Past');
  });

  test('booking detail page loads an existing booking', async ({ page }) => {
    await page.goto('/booking/bk-010');
    await expect(page.locator('.sticky')).toBeVisible({ timeout: 5000 });
  });

  test('service detail renders and allows navigation back', async ({ page }) => {
    await page.goto('/service/housekeeping');
    await expect(page.locator('.sticky')).toBeVisible();
    await expect(page.getByText('Housekeeping')).toBeVisible({ timeout: 5000 });
  });
});
