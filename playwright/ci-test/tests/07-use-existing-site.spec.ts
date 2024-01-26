import { test, expect } from '@playwright/test';

let url = '/';

test.use({
  storageState: 'auth.json'
});


test.describe('test - use existing site', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto(url);
  });

  test('test demo data', async ({ page }) => {
    //await page.goto(url);
    await page.getByRole('img', { name: 'crab_placeholder' }).nth(2).click();
    await page.getByPlaceholder('River name').click();
    await page.getByPlaceholder('River name').fill('demo2');
    await page.getByPlaceholder('Site name').click();
    await page.getByPlaceholder('Site name').fill('demo2');
    //await page.locator('input[name="siteDescription"]').click();
    await page.locator('textarea[name="siteDescription"]').fill('downstream demo');
    await page.locator('select[name="rivercategory"]').selectOption('rocky');

    await page.getByRole('button', { name: 'Type in coordinates' }).click();
    await expect(page.getByText('Degree')).toBeVisible();
    await page.locator('#Latitude').fill('-25.000000');
    await page.locator('#Longitude').fill('22.000000');

    await page.getByPlaceholder('01.01.2024').fill('2024-01-10');
    await page.getByPlaceholder('Collectors name:').click();
    await page.getByPlaceholder('Collectors name:').fill('admin');
    //await page.locator('input[name="notes"]').click();
    await page.locator('textarea[name="notes"]').fill('downstream demo2');
    await page.getByPlaceholder('Water clarity (cm):').click();
    await page.getByPlaceholder('Water clarity (cm):').fill('5');
    await page.getByPlaceholder('Water temperature (°C):').click();
    await page.getByPlaceholder('Water temperature (°C):').fill('10');
    await page.getByPlaceholder('pH:').click();
    await page.getByPlaceholder('pH:').fill('8');
    await page.locator('input[name="dissolvedoxygenOne"]').click();
    await page.locator('input[name="dissolvedoxygenOne"]').fill('9');
    await page.locator('input[name="electricalconduOne"]').click();
    await page.locator('input[name="electricalconduOne"]').fill('2');
    await page.getByRole('button', { name: 'next' }).click();
    await page.locator('#checkbox-2').check();
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('heading', { name: 'Observation Saved.' })).toBeVisible();
    await expect(page.getByRole('dialog')).toContainText('The record was saved successfully.');
    await page.getByRole('button', { name: 'Ok' }).click();
    await page.getByRole('img', { name: 'close' }).click();


  });

  // new test
  test('test - use existing site', async ({ page }) => {
    await page.getByRole('img', { name: 'crab_placeholder' }).nth(2).click();
    //await page.getByRole('button', { name: 'Add Record' }).click();
    await page.getByText('Use Existing Site').click();
    await expect(page.getByRole('button', { name: 'Upload site images' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Select site on map' })).toBeVisible();
    await expect(page.getByText('Sites:')).toBeVisible();
    await page.locator('.css-19bb58m').click();
    await page.getByText('demo2', { exact: true }).click();
    await page.getByPlaceholder('01.01.2024').fill('2024-01-11');
    await page.getByPlaceholder('Collectors name:').click();
    await page.getByPlaceholder('Collectors name:').fill('admin');
    //await page.locator('input[name="notes"]').click();
    await page.locator('textarea[name="notes"]').fill('upstream demo');
    await page.getByPlaceholder('Water clarity (cm):').click();
    await page.getByPlaceholder('Water clarity (cm):').fill('4');
    await page.getByPlaceholder('Water temperature (°C):').click();
    await page.getByPlaceholder('Water temperature (°C):').fill('13');
    await page.getByPlaceholder('pH:').click();
    await page.getByPlaceholder('pH:').fill('6');
    await page.locator('input[name="dissolvedoxygenOne"]').click();
    await page.locator('input[name="dissolvedoxygenOne"]').fill('4');
    await page.locator('input[name="electricalconduOne"]').click();
    await page.locator('input[name="electricalconduOne"]').fill('1');
    await page.getByRole('button', { name: 'next' }).click();
    await page.locator('#checkbox-5').check();
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('heading', { name: 'Observation Saved.' })).toBeVisible();
    await expect(page.getByRole('dialog')).toContainText('The record was saved successfully.');
    await page.getByRole('button', { name: 'Ok' }).click();
    await page.getByRole('img', { name: 'close' }).click();
  });

});