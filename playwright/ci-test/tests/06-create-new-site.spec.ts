import { test, expect } from '@playwright/test';

let url = '/';

test.use({
  storageState: 'auth.json'
});

test('test', async ({ page }) => {
  await page.goto(url);
  await page.getByRole('img', { name: 'crab_placeholder' }).nth(2).click();
  await page.getByPlaceholder('River name').click();
  await page.getByPlaceholder('River name').fill('test');
  await page.getByPlaceholder('Site name').click();
  await page.getByPlaceholder('Site name').fill('test');
  await page.locator('input[name="siteDescription"]').click();
  await page.locator('input[name="siteDescription"]').fill('downstream test');
  await page.getByRole('button', { name: 'Select on map' }).click();
  await page.getByLabel('Map').click({
    position: {
      x: 420,
      y: 177
    }
  });
  await page.getByPlaceholder('01.01.2024').fill('2024-01-09');
  await page.getByPlaceholder('Collectors name:').click();
  await page.getByPlaceholder('Collectors name:').fill('admin');
  await page.locator('input[name="notes"]').click();
  await page.locator('input[name="notes"]').fill('downstream');
  await page.getByPlaceholder('Water clarity (cm):').click();
  await page.getByPlaceholder('Water clarity (cm):').fill('5');
  await page.getByPlaceholder('Water temperature (°C):').click();
  await page.getByPlaceholder('Water temperature (°C):').fill('15');
  await page.getByPlaceholder('pH:').click();
  await page.getByPlaceholder('pH:').fill('8');
  await page.locator('input[name="dissolvedoxygenOne"]').click();
  await page.locator('input[name="dissolvedoxygenOne"]').fill('12');
  await page.locator('input[name="electricalconduOne"]').click();
  await page.locator('input[name="electricalconduOne"]').fill('3');
  await page.getByRole('button', { name: 'next' }).click();
  await page.locator('#checkbox-50').check();
  await expect(page.getByText('17.00117.00')).toBeVisible();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('heading', { name: 'Observation Saved.' })).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('The record was saved successfully.');
  await page.getByRole('button', { name: 'Ok' }).click();
  await page.getByRole('img', { name: 'close' }).click();
  await page.getByRole('button', { name: 'Home' }).click();

  await expect(page.getByText('test')).toBeVisible();
  await expect(page.getByText('Username: admin').first()).toBeVisible();
  await expect(page.getByText('Organisation:').first()).toBeVisible();
  await expect(page.getByText('Score:17.00')).toBeVisible();
});