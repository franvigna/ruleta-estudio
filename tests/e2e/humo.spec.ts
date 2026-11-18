import { test, expect } from '@playwright/test';

test('adapta el catalogo a celular y alterna el tema visual', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/');

  const botonTema = page.getByRole('button', { name: 'Activar tema oscuro' });
  await expect(botonTema).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'claro');
  expect(await page.evaluate('document.documentElement.scrollWidth')).toBeLessThanOrEqual(360);

  await botonTema.click();

  await expect(page.locator('html')).toHaveAttribute('data-tema', 'oscuro');
  await expect(page.getByRole('button', { name: 'Activar tema claro' })).toBeVisible();
});

test('superpone la tarjeta sobre la ruleta en movil, tablet y escritorio', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });

  for (const viewport of [
    { width: 360, height: 740 },
    { width: 768, height: 900 },
    { width: 1280, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/#/materia/programacion-avanzada');

    const vistaRuleta = page.locator('section[aria-label="Ruleta"]');
    await expect(vistaRuleta).toBeVisible();
    const volver = page.getByRole('link', { name: 'Volver a las materias' });
    const progreso = page.getByRole('link', { name: 'Progreso' });
    const tema = page.getByRole('button', { name: 'Activar tema oscuro' });
    await expect(volver).toBeVisible();
    await expect(progreso).toBeVisible();
    await expect(tema).toBeVisible();

    const [cajaVolver, cajaProgreso, cajaTema] = await Promise.all([
      volver.boundingBox(),
      progreso.boundingBox(),
      tema.boundingBox(),
    ]);
    expect(cajaVolver).not.toBeNull();
    expect(cajaProgreso).not.toBeNull();
    expect(cajaTema).not.toBeNull();
    expect(cajaVolver!.x).toBeLessThan(cajaProgreso!.x);
    expect(cajaProgreso!.x).toBeLessThan(cajaTema!.x);
    expect(Math.abs(cajaProgreso!.x + cajaProgreso!.width / 2 - viewport.width / 2)).toBeLessThan(
      2,
    );

    await page.getByRole('button', { name: 'Girar la ruleta' }).click();

    const dialogo = page.getByRole('dialog', { name: /^Pregunta de / });
    await expect(dialogo).toBeVisible();
    const tarjeta = page.getByRole('button', { name: 'Tarjeta: tocá para ver la respuesta' });
    const preguntaOriginal = await tarjeta.textContent();
    await expect(vistaRuleta).toBeHidden();
    expect(await page.evaluate('document.documentElement.scrollWidth')).toBeLessThanOrEqual(
      viewport.width,
    );

    await page.getByRole('button', { name: 'Cerrar tarjeta y volver a la ruleta' }).click();
    await expect(dialogo).toHaveCount(0);
    await expect(vistaRuleta).toBeVisible();
    await page.getByRole('button', { name: 'Ver pregunta' }).click();
    await expect(dialogo).toBeVisible();
    expect(await tarjeta.textContent()).toBe(preguntaOriginal);
    await page.getByRole('button', { name: 'Cerrar tarjeta y volver a la ruleta' }).click();
  }

  await page.getByRole('button', { name: 'Girar la ruleta' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Volver a girar la ruleta' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('section[aria-label="Ruleta"]')).toBeVisible();
});

test('estudiar una pregunta y conservar el progreso al recargar', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await expect(page.getByRole('heading', { name: 'Ruleta de Estudio' })).toBeVisible();
  await expect(page.getByText('Ejemplo: Sistema Solar')).toHaveCount(0);
  await page.getByRole('link', { name: /Programación Avanzada/ }).click();
  await expect(
    page.getByRole('heading', { name: 'Ruleta de Programación Avanzada' }),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Girar la ruleta' }).click();
  const tarjeta = page.getByRole('button', { name: 'Tarjeta: tocá para ver la respuesta' });
  await expect(tarjeta).toBeVisible();
  await tarjeta.click();
  await page.getByRole('button', { name: 'No me la sabía', exact: true }).click();
  await page.getByRole('button', { name: 'Me la sabía', exact: true }).click();
  await expect(page.getByText('Sale de la ruleta.')).toBeVisible();
  await expect(page.getByRole('button', { name: /Tarjeta:/ })).toHaveAttribute('data-marca', 'si');

  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Ruleta de Programación Avanzada' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Progreso' }).click();

  const datoSabidas = page.getByText('sabidas de 331').locator('..');
  await expect(datoSabidas.getByText('1', { exact: true })).toBeVisible();

  const catalogo = page.locator('section[aria-labelledby="titulo-catalogo-preguntas"]');
  await expect(catalogo).toBeVisible();
  const [cajaCatalogo, cajaPrincipal] = await Promise.all([
    catalogo.boundingBox(),
    page.locator('main').boundingBox(),
  ]);
  expect(cajaCatalogo).not.toBeNull();
  expect(cajaPrincipal).not.toBeNull();
  expect(cajaCatalogo!.width / cajaPrincipal!.width).toBeGreaterThan(0.9);

  const primerTema = catalogo.locator('details').first();
  await primerTema.locator(':scope > summary').click();
  const primeraPregunta = primerTema.locator('ol details').first();
  await primeraPregunta.locator(':scope > summary').click();
  await expect(primeraPregunta.getByRole('heading', { name: 'Respuesta' })).toBeVisible();

  await page.getByRole('button', { name: 'Temas para reforzar' }).click();
  await expect(page.getByText('1 fallo')).toBeVisible();

  await page.setViewportSize({ width: 360, height: 740 });
  expect(await page.evaluate('document.documentElement.scrollWidth')).toBeLessThanOrEqual(360);
  await expect(page.getByRole('button', { name: 'Todas' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Temas para reforzar' })).toBeVisible();
});
