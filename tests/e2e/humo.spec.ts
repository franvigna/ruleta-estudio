import { test, expect } from '@playwright/test';

test('estudiar una pregunta y conservar el progreso al recargar', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await expect(page.getByRole('heading', { name: 'Ruleta de Estudio' })).toBeVisible();
  await page.getByRole('link', { name: /Programación Avanzada/ }).click();
  await expect(
    page.getByRole('heading', { name: 'Ruleta de Programación Avanzada' }),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Girar la ruleta' }).click();
  const tarjeta = page.getByRole('button', { name: 'Tarjeta: tocá para ver la respuesta' });
  await expect(tarjeta).toBeVisible();
  await tarjeta.click();
  await page.getByRole('button', { name: 'Me la sabía', exact: true }).click();
  await expect(page.getByText('Sale de la ruleta.')).toBeVisible();

  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Ruleta de Programación Avanzada' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Ver tu progreso' }).click();

  const datoSabidas = page.getByText('sabidas de 331').locator('..');
  await expect(datoSabidas.getByText('1', { exact: true })).toBeVisible();
});
