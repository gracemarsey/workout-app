import { test, expect } from '@playwright/test';

test('should display login page with form fields', async ({ page }) => {
  await page.goto('/login');
  
  await expect(page.getByRole('heading', { name: 'Workout App' })).toBeVisible();
  await expect(page.getByLabel('Username')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
});
