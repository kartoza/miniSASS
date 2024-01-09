import { test, expect } from '@playwright/test';

let url = '/';

test.use({
  storageState: 'auth.json'
});

test('test', async ({ page }) => {
  await page.goto(url);
  await page.getByRole('button', { name: 'How to' }).click();
  await expect(page.locator('#howto-title')).toBeVisible();
  await expect(page.getByText('How to do a miniSASS survey')).toBeVisible();
  await page.locator('#howto-title').click();
  await page.locator('#howto-title').click();
  await page.goto(url);
  await page.getByRole('button', { name: 'Map', exact: true }).click();
  await expect(page.getByLabel('Map')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add Record' })).toBeVisible();
  await expect(page.getByPlaceholder('Search sites or place')).toBeVisible();
  await expect(page.getByText('Legend')).toBeVisible();
  await page.getByRole('button', { name: 'Home' }).click();
  await page.getByRole('button', { name: 'Contact us' }).click();
  await expect(page.getByText('Contact Form')).toBeVisible();
  await expect(page.getByPlaceholder('Enter your name')).toBeEmpty();
  await expect(page.getByPlaceholder('Enter your email')).toBeEmpty();
  await expect(page.getByPlaceholder('Enter your phone number')).toBeEmpty();
  await expect(page.getByPlaceholder('Enter your message')).toBeEmpty();
  await expect(page.getByRole('img', { name: 'close' })).toBeVisible();
  await page.getByRole('img', { name: 'close' }).click();
});