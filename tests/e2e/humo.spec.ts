import { test, expect } from '@playwright/test';

test('la app carga', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Ruleta de Estudio' })).toBeVisible();
});
