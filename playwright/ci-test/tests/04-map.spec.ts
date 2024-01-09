import { test, expect } from '@playwright/test';

let url = '/';

test.use({
  storageState: 'auth.json'
});

test('test', async ({ page }) => {
  await page.goto(url);
  await expect(page.locator('div').filter({ hasText: /^Explore the map$/ }).nth(2)).toBeVisible();
  await page.getByRole('img', { name: 'crab_placeholder' }).first().click();
  await expect(page.getByLabel('Map')).toBeVisible();
  await expect(page.getByText('Legend')).toBeVisible();
  await expect(page.getByRole('img', { name: 'alarm', exact: true })).toBeVisible();
  await expect(page.locator('#root')).toContainText('Unmodified (NATURAL condition)');
  await expect(page.getByRole('img', { name: 'alarm_One' })).toBeVisible();
  await expect(page.locator('#root')).toContainText('Largely natural/few modifications (GOOD condition)');
  await expect(page.getByRole('img', { name: 'alarm_Two' })).toBeVisible();
  await expect(page.locator('#root')).toContainText('Moderately modified (FAIR condition)');
  await expect(page.getByRole('img', { name: 'twitter' })).toBeVisible();
  await expect(page.locator('#root')).toContainText('Largely modified (POOR condition)');
  await expect(page.getByRole('img', { name: 'alarm_Three' })).toBeVisible();
  await expect(page.locator('#root')).toContainText('Seriously/critically modified(VERY POOR condition)');
  await expect(page.getByRole('img', { name: 'settings' })).toBeVisible();
  await expect(page.locator('#root')).toContainText('No groups present');
  await expect(page.getByRole('img', { name: 'arrowdown' })).toBeVisible();
  await expect(page.locator('#root')).toContainText('Exclamation mark: unverified');
  await expect(page.getByPlaceholder('Search sites or place')).toBeEmpty();
  await page.getByPlaceholder('Search sites or place').click();
  await page.getByPlaceholder('Search sites or place').fill('Pretoria');
  await page.getByText('Pretoria, City of Tshwane').click();
  await page.getByLabel('Clear').click();
  await page.getByLabel('Zoom out').click();
  await page.getByLabel('Zoom out').click();
  await page.getByLabel('Zoom out').click();
  await page.getByLabel('Zoom out').dblclick();
  await page.getByLabel('Zoom out').click();
  await page.getByLabel('Zoom out').click();
  await page.getByLabel('Zoom out').dblclick();
  await page.getByLabel('Zoom out').click();
  await page.locator('div').filter({ hasText: /^L$/ }).getByRole('img').click();
  await page.getByText('L', { exact: true }).click();
});