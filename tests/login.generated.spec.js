import { test, expect } from '@playwright/test';

const BASE_URL = 'https://the-internet.herokuapp.com';
const LOGIN_PATH = '/login';

test.describe('Login - The Internet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}${LOGIN_PATH}`);
  });

  test('Login page loads and has expected UI', async ({ page }) => {
    await expect(page).toHaveURL(new RegExp(`${LOGIN_PATH}$`));
    await expect(page.getByRole('heading', { name: 'Login Page' })).toBeVisible();
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
    await expect(page.locator('text=tomsmith')).toBeVisible();
    await expect(page.locator('text=SuperSecretPassword!')).toBeVisible();
  });

  test('Valid login', async ({ page }) => {
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: /login/i }).click();

    await expect(page).toHaveURL(/\/secure$/);
    //await expect(page.getByRole('heading', { name: 'Secure Area' })).toBeVisible();
    await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
    await expect(page.getByRole('link', { name: /logout/i })).toBeVisible();
  });

  test('Invalid password', async ({ page }) => {
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('wrong-password');
    await page.getByRole('button', { name: /login/i }).click();

    await expect(page).toHaveURL(new RegExp(`${LOGIN_PATH}$`));
    await expect(page.locator('#flash')).toContainText('Your password is invalid!');
  });

  test('Empty fields validation (no username, no password)', async ({ page }) => {
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page).toHaveURL(new RegExp(`${LOGIN_PATH}$`));
    await expect(page.locator('#flash')).toContainText('Your username is invalid!');
  });

  test('Empty password only', async ({ page }) => {
    await page.locator('#username').fill('tomsmith');
    await page.getByRole('button', { name: /login/i }).click();

    await expect(page).toHaveURL(new RegExp(`${LOGIN_PATH}$`));
    await expect(page.locator('#flash')).toContainText('Your password is invalid!');
  });

  test('Invalid username', async ({ page }) => {
    await page.locator('#username').fill('invalid-user');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: /login/i }).click();

    await expect(page).toHaveURL(new RegExp(`${LOGIN_PATH}$`));
    await expect(page.locator('#flash')).toContainText('Your username is invalid!');
  });

  test('Logout after successful login', async ({ page }) => {
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: /login/i }).click();

    await expect(page).toHaveURL(/\/secure$/);
    await page.getByRole('link', { name: /logout/i }).click();

    await expect(page).toHaveURL(new RegExp(`${LOGIN_PATH}$`));
    await expect(page.locator('#flash')).toContainText('You logged out of the secure area!');
  });

  test('Direct navigation to secure redirects to login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/secure`);
    await expect(page).toHaveURL(new RegExp(`${LOGIN_PATH}$`));
    await expect(page.locator('#flash')).toContainText('You must login to view the secure area!');
  });

  test('Flash message can be dismissed', async ({ page }) => {
    await page.getByRole('button', { name: /login/i }).click();
    const flash = page.locator('#flash');

    await expect(flash).toBeVisible();
    await flash.locator('a.close').click();
    await expect(flash).toBeHidden();
  });
});