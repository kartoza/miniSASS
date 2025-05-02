import { test as setup, expect } from '@playwright/test';

let url = '/';

let username = 'kartoza_admin';
let useremail = 'tinashe@kartoza.com';
let password = 'Gs10w29k8*&';
const authFile = 'auth.json'


setup('test', async ({ page }) => {
  await page.goto(url);

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

  await expect(page.getByPlaceholder('Email').first()).toBeEmpty();

  await page.getByPlaceholder('Email').first().click();

  await page.getByPlaceholder('Email').first().fill(useremail);

  await page.getByPlaceholder('Password').click();

  await page.getByPlaceholder('Password').fill(password);

  await page.getByRole('dialog').getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('img', { name: 'iconamoon_profile-circle-fill' })).toBeVisible();

  await page.context().storageState({ path: authFile });
});