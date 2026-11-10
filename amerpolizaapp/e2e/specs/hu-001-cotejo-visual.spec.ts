/**
 * HU-001 — cotejo visual de la pantalla nueva (tarea 6.5, paso 4 de docs/DESIGN-SYSTEM.md).
 *
 * La pantalla de ingreso es la primera pantalla nueva del proyecto, así que sienta
 * precedente. Esta prueba deja la evidencia lado a lado y comprueba con el navegador que los
 * radios, las alturas y la familia tipográfica son los mismos que en una pantalla existente.
 */

import { expect, test } from '@playwright/test';
import { CUENTAS, ingresar } from '../apoyo/sesion';

const CAPTURAS = 'e2e/evidencia/capturas';

type Medidas = { radio: string; alto: string; familia: string };

async function medirInput(page: import('@playwright/test').Page, selector: string) {
  return page.locator(selector).first().evaluate((el): Medidas => {
    const estilo = getComputedStyle(el);
    return {
      radio: estilo.borderRadius,
      alto: `${Math.round(el.getBoundingClientRect().height)}`,
      familia: estilo.fontFamily,
    };
  });
}

test('la pantalla de ingreso usa los mismos radios, alturas y tipografía que una existente', async ({
  page,
}) => {
  // Pantalla nueva.
  await page.goto('/login');
  await expect(page.getByTestId('login-enviar')).toBeVisible();
  const inputLogin = await medirInput(page, '.inp');
  const botonLogin = await medirInput(page, '.btn-pri');
  const tarjetaLogin = await page
    .locator('.card')
    .first()
    .evaluate((el) => getComputedStyle(el).borderRadius);
  await page.screenshot({ path: `${CAPTURAS}/hu-001-cotejo-login.png`, fullPage: true });

  // Pantalla existente de referencia: el formulario de cliente nuevo.
  await ingresar(page, CUENTAS.administradora.correo);
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.goto('/clientes/nuevo');
  await expect(page.locator('.inp').first()).toBeVisible();
  const inputExistente = await medirInput(page, '.inp');
  const botonExistente = await medirInput(page, '.btn-pri');
  const tarjetaExistente = await page
    .locator('.card')
    .first()
    .evaluate((el) => getComputedStyle(el).borderRadius);
  await page.screenshot({ path: `${CAPTURAS}/hu-001-cotejo-existente.png`, fullPage: true });

  expect(inputLogin).toEqual(inputExistente);
  expect(botonLogin.radio).toBe(botonExistente.radio);
  expect(botonLogin.alto).toBe(botonExistente.alto);
  expect(botonLogin.familia).toBe(botonExistente.familia);
  expect(tarjetaLogin).toBe(tarjetaExistente);
});

test('el panel de la izquierda usa el mismo degradado que la barra lateral', async ({ page }) => {
  await page.goto('/login');
  const degradadoLogin = await page
    .locator('.login-hero')
    .evaluate((el) => getComputedStyle(el).backgroundImage);

  await ingresar(page, CUENTAS.administradora.correo);
  await expect(page).toHaveURL(/\/dashboard$/);
  const degradadoBarra = await page
    .locator('.side')
    .evaluate((el) => getComputedStyle(el).backgroundImage);

  expect(degradadoLogin).toBe(degradadoBarra);
});

test('la pantalla de ingreso se ve bien en un teléfono', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto('/login');

  await expect(page.getByTestId('login-correo')).toBeVisible();
  await expect(page.getByTestId('login-enviar')).toBeVisible();
  const desbordaHorizontal = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(desbordaHorizontal).toBe(false);
  await page.screenshot({ path: `${CAPTURAS}/hu-001-cotejo-telefono.png`, fullPage: true });
});
