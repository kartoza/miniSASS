import { test as setup, expect } from '@playwright/test';

let url = '/';

let username = 'admin';
let password = 'admin';
const authFile = 'auth.json'


setup('test', async ({ page }) => {
  await page.goto(url);

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

  await expect(page.getByPlaceholder('Username')).toBeEmpty();

  await page.getByPlaceholder('Username').click();

  await page.getByPlaceholder('Username').fill(username);

  await page.getByPlaceholder('Password').click();

  await page.getByPlaceholder('Password').fill(password);

  await page.getByRole('dialog').getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('img', { name: 'iconamoon_profile-circle-fill' })).toBeVisible();

  await page.context().storageState({ path: authFile });
});