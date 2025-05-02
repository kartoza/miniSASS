import { test, expect } from '@playwright/test';

let url = '/';

test.use({
  storageState: 'auth.json'
});

test('test', async ({ page }) => {
  await page.goto(url);
  await page.getByRole('img', { name: 'iconamoon_profile-circle-fill' }).click();

  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByRole('link', { name: 'Group Scores' }).click();
  await page.getByRole('link', { name: 'Add group scores' }).click();

  await page.getByLabel('Name:').click();
  await page.getByLabel('Name:').fill('Crabs or Shrimps');
  await page.getByLabel('Sensitivity score:').click();
  await page.getByLabel('Sensitivity score:').fill('6.0');
  await page.getByRole('button', { name: 'Save and add another' }).click();

  await page.getByLabel('Name:').click();
  await page.getByLabel('Name:').fill('Stoneflies');
  await page.getByLabel('Sensitivity score:').click();
  await page.getByLabel('Sensitivity score:').fill('17.00');
  await page.getByRole('button', { name: 'Save and add another' }).click();

  await page.getByLabel('Name:').click();
  await page.getByLabel('Name:').fill('Minnow Mayflies');
  await page.getByLabel('Sensitivity score:').click();
  await page.getByLabel('Sensitivity score:').fill('5.00');
  await page.getByRole('button', { name: 'Save and add another' }).click();

  await page.getByLabel('Name:').click();
  await page.getByLabel('Name:').fill('Other Mayflies');
  await page.getByLabel('Sensitivity score:').click();
  await page.getByLabel('Sensitivity score:').fill('11.00');
  await page.getByRole('button', { name: 'Save and add another' }).click();

  await page.getByLabel('Name:').click();
  await page.getByLabel('Name:').fill('Leeches');
  await page.getByLabel('Sensitivity score:').click();
  await page.getByLabel('Sensitivity score:').fill('2.00');
  await page.getByRole('button', { name: 'Save and add another' }).click();

  await page.getByLabel('Name:').click();
  await page.getByLabel('Name:').fill('Worms');
  await page.getByLabel('Sensitivity score:').click();
  await page.getByLabel('Sensitivity score:').fill('2.00');
  await page.getByRole('button', { name: 'Save and add another' }).click();

  await page.getByLabel('Name:').click();
  await page.getByLabel('Name:').fill('Damselflies');
  await page.getByLabel('Sensitivity score:').click();
  await page.getByLabel('Sensitivity score:').fill('4.00');
  await page.getByRole('button', { name: 'Save and add another' }).click();

  await page.getByLabel('Name:').click();
  await page.getByLabel('Name:').fill('Dragonflies');
  await page.getByLabel('Sensitivity score:').click();
  await page.getByLabel('Sensitivity score:').fill('6.00');
  await page.getByRole('button', { name: 'Save and add another' }).click();

  await page.getByLabel('Name:').click();
  await page.getByLabel('Name:').fill('Bugs or Beetles');
  await page.getByLabel('Sensitivity score:').click();
  await page.getByLabel('Sensitivity score:').fill('5.00');
  await page.getByRole('button', { name: 'Save and add another' }).click();

  await page.getByLabel('Name:').click();
  await page.getByLabel('Name:').fill('Caddisflies');
  await page.getByLabel('Sensitivity score:').click();
  await page.getByLabel('Sensitivity score:').fill('9.00');
  await page.getByRole('button', { name: 'Save and add another' }).click();

  await page.getByLabel('Name:').click();
  await page.getByLabel('Name:').fill('True Flies');
  await page.getByLabel('Sensitivity score:').click();
  await page.getByLabel('Sensitivity score:').fill('2.00');
  await page.getByRole('button', { name: 'Save and add another' }).click();

  await page.getByLabel('Name:').click();
  await page.getByLabel('Name:').fill('Snails');
  await page.getByLabel('Sensitivity score:').click();
  await page.getByLabel('Sensitivity score:').fill('4.00');
  await page.getByRole('button', { name: 'Save and add another' }).click();

  await page.getByLabel('Name:').click();
  await page.getByLabel('Name:').fill('Flat Worms');
  await page.getByLabel('Sensitivity score:').click();
  await page.getByLabel('Sensitivity score:').fill('3.00');
  await page.getByRole('button', { name: 'Save', exact: true }).click();

  await page.getByRole('link', { name: 'View site' }).click();
  await page.getByRole('button', { name: 'Map', exact: true }).click();
  await page.getByRole('button', { name: 'Add Record' }).click();

  await page.getByPlaceholder('River name').click();
  await page.getByPlaceholder('River name').fill('test');
  await page.getByPlaceholder('Site name').click();
  await page.getByPlaceholder('Site name').fill('test');
  await page.locator('textarea[name="siteDescription"]').click();
  await page.locator('textarea[name="siteDescription"]').fill('test');
  await page.getByRole('button', { name: 'Select on map' }).click();
  await page.getByLabel('Map').click({
    position: {
      x: 525,
      y: 198
    }
  });
  await page.getByLabel('Map').click({
    position: {
      x: 581,
      y: 298
    }
  });
  await page.getByPlaceholder('01.01.2024').fill('2024-01-19');

  await page.getByRole('button', { name: 'next' }).click();
  
  await expect(page.getByText('Crabs or Shrimps')).toBeVisible({timeout: 20000});
  await expect(page.getByText('Stoneflies')).toBeVisible();
  await expect(page.getByText('Minnow Mayflies')).toBeVisible();
  await expect(page.getByText('Other Mayflies')).toBeVisible();
  await expect(page.getByText('Leeches')).toBeVisible();
  await expect(page.getByText('Worms', { exact: true })).toBeVisible();
  await expect(page.getByText('Damselflies')).toBeVisible();
  await expect(page.getByText('Dragonflies')).toBeVisible();
  await expect(page.getByText('Bugs or Beetles')).toBeVisible();
  await expect(page.getByText('Caddisflies')).toBeVisible();
  await expect(page.getByText('True Flies')).toBeVisible();
  await expect(page.getByText('Snails')).toBeVisible();
  await expect(page.getByText('Flat Worms')).toBeVisible();
  await page.getByRole('img', { name: 'close' }).click();
});
