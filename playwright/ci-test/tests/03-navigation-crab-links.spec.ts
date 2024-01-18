import { test, expect } from '@playwright/test';

let url = '/';

test.use({
  storageState: 'auth.json'
});

test('test', async ({ page }) => {
  await page.goto(url);
  await expect(page.locator('.sm\\:bottom-20')).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Explore the map$/ }).nth(2)).toBeVisible();
  await page.getByRole('img', { name: 'crab_placeholder' }).first().click();
  await expect(page.getByLabel('Map')).toBeVisible();
  await expect(page.getByText('Legend')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add Record' })).toBeVisible();
  await expect(page.getByPlaceholder('Search sites or place')).toBeEmpty();
  await page.getByRole('button', { name: 'Home' }).click();
  await expect(page.locator('div').filter({ hasText: /^How to do miniSASS$/ }).nth(2)).toBeVisible();
  await page.getByRole('img', { name: 'crab_placeholder' }).nth(1).click();
  await expect(page.locator('#howto-title')).toBeVisible();
  await expect(page.getByText('How to do a miniSASS survey')).toBeVisible();
  await page.getByRole('button', { name: 'Home' }).click();
  await expect(page.locator('div').filter({ hasText: /^Submit results$/ }).nth(2)).toBeVisible();
  await page.getByRole('img', { name: 'crab_placeholder' }).nth(2).click();
  await expect(page.locator('.absolute').first()).toBeVisible();
  await expect(page.getByText('Data Input Form')).toBeVisible();
  await expect(page.getByText('Site Details')).toBeVisible();
  await expect(page.locator('label').filter({ hasText: 'Create New Site' })).toBeVisible();
  await expect(page.getByText('Use Existing Site')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Upload site images' })).toBeVisible();
  await expect(page.getByPlaceholder('River name')).toBeEmpty();
  await expect(page.getByPlaceholder('Site name')).toBeEmpty();
  await expect(page.locator('input[name="siteDescription"]')).toBeEmpty();
  await expect(page.locator('select[name="rivercategory"]')).toHaveValue('rocky');
  await expect(page.getByText('River categoryRockySandy')).toBeVisible();
  await expect(page.getByPlaceholder('Search sites or place')).toBeEmpty();
  await expect(page.getByText('Legend')).toBeVisible();
  await expect(page.getByLabel('Map')).toBeVisible();
  await page.getByRole('button', { name: 'Home' }).click();
  await expect(page.getByText('Resources;')).toBeVisible();
  await page.getByRole('img', { name: 'crab_placeholder' }).nth(3).click();
  await page.getByRole('link', { name: 'Resources' }).click();
  await expect(page.locator('#howto-title')).toBeVisible();
  await expect(page.getByText('How to do a miniSASS survey')).toBeVisible();
  await expect(page.getByText('MiniSASS survey: How to do a')).toBeVisible();
});