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
  await page.goto('https://minisass.sta.do.kartoza.com/');
  //const page1Promise = page.waitForEvent('popup');
  //await page.getByRole('link', { name: 'Wildlife and Environment' }).click();
  //const page1 = await page1Promise;
  await page.getByRole('list').getByText('Map').click();
  await page.goto('https://minisass.sta.do.kartoza.com/#/map');
  await expect(page.getByLabel('Map')).toBeVisible();
  await expect(page.getByText('Legend')).toBeVisible();
  await expect(page.locator('#root')).toContainText('Unmodified (NATURAL condition)');
  await expect(page.locator('#root')).toContainText('Largely natural/few modifications (GOOD condition)');
  await expect(page.locator('#root')).toContainText('Moderately modified (FAIR condition)');
  await expect(page.locator('#root')).toContainText('Largely modified (POOR condition)');
  await expect(page.locator('#root')).toContainText('Seriously/critically modified(VERY POOR condition)');
  await expect(page.locator('#root')).toContainText('No groups present');
  await expect(page.locator('#root')).toContainText('Exclamation mark: unverified');
  await page.getByLabel('Zoom in').click();
  await page.getByLabel('Zoom in').click();
  await page.getByLabel('Zoom out').click();
  await page.getByLabel('Zoom out').click();
  await page.getByLabel('Reset bearing to north').click();
  await page.locator('div').filter({ hasText: /^L$/ }).click();
  await page.locator('div').filter({ hasText: /^L$/ }).getByRole('img').click();
  await expect(page.getByText('Legend')).toBeVisible();
  await expect(page.getByPlaceholder('Search sites or place')).toBeEmpty();
  
  await expect(page.getByRole('button', { name: 'Add Record' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Map' })).toBeVisible();
  await page.getByRole('button', { name: 'Add Record' }).click();
  await page.getByPlaceholder('Search sites or place').click();
  await expect(page.getByText('Data Input Form')).toBeVisible();
  await expect(page.getByText('Site Details')).toBeVisible();
  await expect(page.getByText('Create New Site')).toBeVisible();
  await expect(page.getByPlaceholder('River name')).toBeEmpty();
  await expect(page.getByPlaceholder('Site name')).toBeEmpty();
  await expect(page.locator('textarea[name="siteDescription"]')).toBeEmpty();
  await expect(page.locator('select[name="rivercategory"]')).toHaveValue('rocky');
  await page.getByText('River categoryRockySandy').click();
  await expect(page.getByText('Site location')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Select on map' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Type in coordinates' })).toBeVisible();
  await expect(page.getByPlaceholder('01.01.2024')).toBeEmpty();
  await expect(page.getByPlaceholder('Collectors name:')).toBeEmpty();
  await expect(page.locator('textarea[name="notes"]')).toBeEmpty();
  await expect(page.getByText('Measurements')).toBeVisible();
  await expect(page.getByPlaceholder('Water clarity (cm):')).toBeEmpty();
  await expect(page.getByPlaceholder('Water temperature (°C):')).toBeEmpty();
  await expect(page.getByPlaceholder('pH:')).toBeEmpty();
  await expect(page.locator('input[name="dissolvedoxygenOne"]')).toBeEmpty();
  await expect(page.locator('input[name="electricalconduOne"]')).toBeEmpty();
  await page.getByRole('button', { name: 'next' }).click();
  await expect(page.getByText('Score', { exact: true })).toBeVisible();
  await expect(page.getByText('Groups', { exact: true })).toBeVisible();
  await expect(page.getByText('Sensitivity Score')).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Crabs or Shrimps$/ }).first()).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Stoneflies$/ }).first()).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Minnow Mayflies$/ }).first()).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Other Mayflies$/ }).first()).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Leeches$/ }).first()).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Worms$/ }).first()).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Damselflies$/ }).first()).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Dragonflies$/ }).first()).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Bugs or Beetles$/ }).first()).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Caddisflies$/ }).first()).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^True Flies$/ }).first()).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Snails$/ }).first()).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Flat Worms$/ }).first()).toBeVisible();
  await expect(page.locator('#root')).toContainText('Total score:Number of groups:Average score:');
  await page.locator('#checkbox-4').check();
  await page.getByRole('button', { name: 'Back' }).click();
  await page.getByRole('img', { name: 'close' }).click();
});