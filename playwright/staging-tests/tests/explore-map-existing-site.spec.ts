import { test, expect } from '@playwright/test';

test.use({
  storageState: 'auth.json',
  viewport: {
    height: 680,
    width: 1200
  }
});

test('test', async ({ page }) => {
  await page.goto('https://minisass.sta.do.kartoza.com/#/');
  await page.getByRole('button', { name: 'Map', exact: true }).click();
  await page.getByRole('button', { name: 'Add Record' }).click();
  await page.getByText('Use Existing Site').click();
  await page.getByRole('button', { name: 'Select site on map' }).click();
  await page.getByRole('button', { name: 'Disable' }).click();
  await page.getByRole('button', { name: 'Select site on map' }).click();
  await page.locator('div').filter({ hasText: /^Sites:$/ }).locator('svg').click();
  await page.getByText('test_sites', { exact: true }).click();
  await expect(page.getByText('Site location')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Disable' })).toBeVisible();
  await page.getByPlaceholder('01.01.2024').fill('2024-01-08');
  await page.getByPlaceholder('Collectors name:').click();
  await page.locator('textarea[name="notes"]').click();
  await page.getByPlaceholder('Collectors name:').click();
  await expect(page.getByPlaceholder('Collectors name:')).toBeEmpty();
  await expect(page.locator('textarea[name="notes"]')).toBeEmpty();
  await expect(page.getByText('Measurements')).toBeVisible();
  await expect(page.getByPlaceholder('Water clarity (cm):')).toBeEmpty();
  await expect(page.getByPlaceholder('Water temperature (°C):')).toBeEmpty();
  await expect(page.getByPlaceholder('pH:')).toBeEmpty();
  await expect(page.locator('input[name="dissolvedoxygenOne"]')).toBeEmpty();
  await expect(page.locator('input[name="electricalconduOne"]')).toBeEmpty();
  await page.getByRole('button', { name: 'next' }).click();
  await page.goto('https://minisass.sta.do.kartoza.com/#/map');
});