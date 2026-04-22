import { test, expect } from '@playwright/test';

test.describe('Smoke', () => {
    test('首頁載入並含主標', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('heading', { level: 1, name: /BNI 長輝白金分會/ })).toBeVisible();
    });

    test('會員頁可開啟', async ({ page }) => {
        await page.goto('/members');
        await expect(page).toHaveURL(/\/members/);
    });

    test('登入頁可開啟', async ({ page }) => {
        await page.goto('/login');
        await expect(page.getByRole('heading', { name: /會員登入/i })).toBeVisible();
    });
});
