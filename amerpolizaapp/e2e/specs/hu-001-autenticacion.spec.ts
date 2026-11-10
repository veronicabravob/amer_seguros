/**
 * HU-001 — Autenticación de usuario.
 *
 * Un `test()` por cada `#### Scenario` de
 * `openspec/changes/hu-001-autenticacion/specs/autenticacion/spec.md`.
 */

import { expect, test } from '@playwright/test';
import {
  CUENTAS,
  PASSWORD,
  VENTANA_BLOQUEO_SEG,
  envejecerSesiones,
  fijarEstadoDeCuenta,
  ingresar,
  limpiarIntentos,
  ultimoUsoDeLaSesion,
} from '../apoyo/sesion';

const CAPTURAS = 'e2e/evidencia/capturas';

test.describe('Requirement · Ingreso con credenciales válidas', () => {
  test('@regresion CA-1 · credenciales correctas de usuario activo', async ({ page }) => {
    await page.goto('/login');

    await ingresar(page, CUENTAS.administradora.correo);

    await expect(page).toHaveURL(/\/dashboard$/);
    const pie = page.getByTestId('side-usuario');
    await expect(pie).toContainText(CUENTAS.administradora.nombre);
    await expect(pie).toContainText(CUENTAS.administradora.rol);
    await page.screenshot({ path: `${CAPTURAS}/hu-001-ca1-ingreso.png`, fullPage: true });
  });

  test('CA-1 · el correo se normaliza antes de buscar la cuenta', async ({ page }) => {
    await page.goto('/login');

    await ingresar(page, '  LAURA.Gomez@AmerSeguros.COM  ');

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByTestId('side-usuario')).toContainText(CUENTAS.administradora.nombre);
  });

  test('CA-1 · los datos de la sesión se consultan con el token', async ({ page, request }) => {
    await page.goto('/login');
    await ingresar(page, CUENTAS.asesor.correo);
    await expect(page).toHaveURL(/\/dashboard$/);

    const cookies = await page.context().cookies();
    const sesion = cookies.find((c) => c.name === 'sesion');
    const respuesta = await request.get('/api/auth/me', {
      headers: { Cookie: `sesion=${sesion?.value}` },
    });
    const cuerpo = await respuesta.json();

    expect(respuesta.status()).toBe(200);
    expect(cuerpo.correo).toBe(CUENTAS.asesor.correo);
    expect(cuerpo.rol).toBe(CUENTAS.asesor.rol);
    expect(JSON.stringify(cuerpo)).not.toContain('password');
  });

  test('CA-1 · la cookie de sesión no es legible desde JavaScript', async ({ page }) => {
    await page.goto('/login');
    await ingresar(page, CUENTAS.administradora.correo);
    await expect(page).toHaveURL(/\/dashboard$/);

    const visibleDesdeJs = await page.evaluate(() => document.cookie);
    const cookies = await page.context().cookies();

    expect(visibleDesdeJs).not.toContain('sesion');
    expect(cookies.find((c) => c.name === 'sesion')?.httpOnly).toBe(true);
  });
});

test.describe('Requirement · Rechazo de credenciales inválidas', () => {
  test('@regresion CA-2 · correo inexistente', async ({ page }) => {
    await page.goto('/login');

    await ingresar(page, 'nadie@amerseguros.com');

    await expect(page.getByTestId('login-error')).toHaveText(/Correo o contraseña incorrectos/);
    await expect(page).toHaveURL(/\/login$/);
  });

  test('@regresion CA-2 · contraseña incorrecta, con el mismo mensaje', async ({ page }) => {
    await page.goto('/login');
    await ingresar(page, 'nadie@amerseguros.com');
    const mensajeCorreoInexistente = await page.getByTestId('login-error').textContent();

    await page.reload();
    await ingresar(page, CUENTAS.administradora.correo, 'contrasena-incorrecta');

    const mensajeContrasenaMala = await page.getByTestId('login-error').textContent();
    expect(mensajeContrasenaMala).toBe(mensajeCorreoInexistente);
    await page.screenshot({ path: `${CAPTURAS}/hu-001-ca2-error.png`, fullPage: true });
  });

  test('CA-2 · la pantalla conserva el correo y vacía la contraseña', async ({ page }) => {
    await page.goto('/login');

    await ingresar(page, CUENTAS.administradora.correo, 'contrasena-incorrecta');

    await expect(page.getByTestId('login-error')).toBeVisible();
    await expect(page.getByTestId('login-correo')).toHaveValue(CUENTAS.administradora.correo);
    await expect(page.getByTestId('login-password')).toHaveValue('');
    await expect(page).toHaveURL(/\/login$/);
  });
});

test.describe('Requirement · Bloqueo de cuenta inactiva', () => {
  test('@regresion CA-3 · credenciales correctas con cuenta inactiva', async ({ page }) => {
    await page.goto('/login');

    await ingresar(page, CUENTAS.inactiva.correo);

    await expect(page.getByTestId('login-error')).toHaveText(
      /Tu cuenta está inactiva, contacta al administrador/,
    );
    await expect(page).toHaveURL(/\/login$/);
    await page.screenshot({ path: `${CAPTURAS}/hu-001-ca3-inactiva.png`, fullPage: true });
  });

  test('CA-3 · la cuenta se desactiva con la sesión abierta', async ({ page }) => {
    await page.goto('/login');
    await ingresar(page, CUENTAS.cobros.correo);
    await expect(page).toHaveURL(/\/dashboard$/);

    fijarEstadoDeCuenta(CUENTAS.cobros.correo, 'Inactivo');
    try {
      await page.goto('/polizas');
      await expect(page).toHaveURL(/\/login$/);
    } finally {
      fijarEstadoDeCuenta(CUENTAS.cobros.correo, 'Activo');
    }
  });
});

test.describe('Requirement · Bloqueo temporal por intentos fallidos', () => {
  test.afterEach(() => {
    limpiarIntentos(CUENTAS.cobros.correo);
  });

  test('@regresion RN-2 · cinco intentos fallidos del mismo correo', async ({ page }) => {
    await page.goto('/login');

    for (let intento = 0; intento < 5; intento += 1) {
      await ingresar(page, CUENTAS.cobros.correo, 'contrasena-incorrecta');
      await expect(page.getByTestId('login-error')).toBeVisible();
    }

    // Con la contraseña correcta tampoco entra.
    await ingresar(page, CUENTAS.cobros.correo);
    await expect(page.getByTestId('login-error')).toHaveText(
      /Demasiados intentos. Intenta de nuevo en 15 minutos/,
    );
    await page.screenshot({ path: `${CAPTURAS}/hu-001-rn2-bloqueo.png`, fullPage: true });
  });

  test('RN-2 · el bloqueo vence', async ({ page }) => {
    test.setTimeout((VENTANA_BLOQUEO_SEG + 60) * 1000);
    await page.goto('/login');
    for (let intento = 0; intento < 5; intento += 1) {
      await ingresar(page, CUENTAS.cobros.correo, 'contrasena-incorrecta');
      await expect(page.getByTestId('login-error')).toBeVisible();
    }
    await ingresar(page, CUENTAS.cobros.correo);
    await expect(page.getByTestId('login-error')).toHaveText(/Demasiados intentos/);

    // La ventana del entorno de pruebas es corta a propósito (ver playwright.config.ts);
    // el valor real de 15 minutos lo fijan las pruebas unitarias.
    await expect(async () => {
      await page.reload();
      await ingresar(page, CUENTAS.cobros.correo);
      await expect(page).toHaveURL(/\/dashboard$/);
    }).toPass({ timeout: (VENTANA_BLOQUEO_SEG + 30) * 1000 });
  });

  test('RN-2 · un ingreso exitoso reinicia el contador', async ({ page }) => {
    await page.goto('/login');
    for (let intento = 0; intento < 3; intento += 1) {
      await ingresar(page, CUENTAS.cobros.correo, 'contrasena-incorrecta');
      await expect(page.getByTestId('login-error')).toBeVisible();
    }

    await ingresar(page, CUENTAS.cobros.correo);
    await expect(page).toHaveURL(/\/dashboard$/);
    await page.getByTestId('btn-cerrar-sesion').click();
    await expect(page).toHaveURL(/\/login$/);
    for (let intento = 0; intento < 4; intento += 1) {
      await ingresar(page, CUENTAS.cobros.correo, 'contrasena-incorrecta');
      await expect(page.getByTestId('login-error')).toBeVisible();
    }

    // Si el contador no se hubiera reiniciado, éstos serían el sexto y el séptimo fallo.
    await ingresar(page, CUENTAS.cobros.correo);
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('RN-2 · el bloqueo es por correo, no por navegador', async ({ page, browser }) => {
    await page.goto('/login');
    for (let intento = 0; intento < 5; intento += 1) {
      await ingresar(page, CUENTAS.cobros.correo, 'contrasena-incorrecta');
      await expect(page.getByTestId('login-error')).toBeVisible();
    }

    const otroNavegador = await browser.newContext();
    const otraPagina = await otroNavegador.newPage();
    await otraPagina.goto('/login');
    await ingresar(otraPagina, CUENTAS.cobros.correo);

    await expect(otraPagina.getByTestId('login-error')).toHaveText(/Demasiados intentos/);
    await otroNavegador.close();
  });
});

test.describe('Requirement · Protección de rutas y de endpoints', () => {
  test('@regresion CA-4 · sin sesión redirige a /login y vuelve a la ruta pedida', async ({
    page,
  }) => {
    await page.goto('/polizas');

    await expect(page).toHaveURL(/\/login$/);
    await ingresar(page, CUENTAS.administradora.correo);

    await expect(page).toHaveURL(/\/polizas$/);
    await page.screenshot({ path: `${CAPTURAS}/hu-001-ca4-retorno.png`, fullPage: true });
  });

  test('@regresion CA-4 · petición al API sin token responde 401', async ({ request }) => {
    const respuesta = await request.get('/api/auth/me');

    expect(respuesta.status()).toBe(401);
    expect((await respuesta.json()).codigo).toBe('sin_sesion');
  });

  test('CA-4 · petición al API con token manipulado responde 401', async ({ page, request }) => {
    await page.goto('/login');
    await ingresar(page, CUENTAS.administradora.correo);
    await expect(page).toHaveURL(/\/dashboard$/);
    const cookies = await page.context().cookies();
    const token = cookies.find((c) => c.name === 'sesion')!.value;

    const respuesta = await request.get('/api/auth/me', {
      headers: { Cookie: `sesion=${token.slice(0, -4)}xxxx` },
    });

    expect(respuesta.status()).toBe(401);
    expect(await respuesta.text()).not.toContain(CUENTAS.administradora.correo);
  });

  test('RN-3 · la sesión caduca por inactividad', async ({ page }) => {
    await page.goto('/login');
    await ingresar(page, CUENTAS.asesor.correo);
    await expect(page).toHaveURL(/\/dashboard$/);

    envejecerSesiones(CUENTAS.asesor.correo, 9);

    await page.goto('/polizas');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('RN-3 · la actividad renueva el plazo de inactividad', async ({ page }) => {
    await page.goto('/login');
    await ingresar(page, CUENTAS.asesor.correo);
    await expect(page).toHaveURL(/\/dashboard$/);
    envejecerSesiones(CUENTAS.asesor.correo, 7);
    const antes = ultimoUsoDeLaSesion(CUENTAS.asesor.correo);

    await page.goto('/polizas');

    await expect(page).toHaveURL(/\/polizas$/);
    expect(new Date(ultimoUsoDeLaSesion(CUENTAS.asesor.correo)).getTime()).toBeGreaterThan(
      new Date(antes).getTime(),
    );
  });
});

test.describe('Requirement · Cierre de sesión', () => {
  test('@regresion CA-5 · token invalidado y vuelta atrás sin datos', async ({ page }) => {
    await page.goto('/login');
    await ingresar(page, CUENTAS.administradora.correo);
    await expect(page).toHaveURL(/\/dashboard$/);
    // Una pantalla con datos de la agencia, para que "volver atrás" apunte a algo real.
    await page.goto('/polizas');
    await expect(page.getByTestId('side-usuario')).toBeVisible();
    const token = (await page.context().cookies()).find((c) => c.name === 'sesion')!.value;

    await page.getByTestId('btn-cerrar-sesion').click();
    await expect(page).toHaveURL(/\/login$/);

    // El token ya no sirve.
    const respuesta = await page.request.get('/api/auth/me', {
      headers: { Cookie: `sesion=${token}` },
    });
    expect(respuesta.status()).toBe(401);

    // Volver atrás no muestra datos de la agencia.
    await page.goBack();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByTestId('side-usuario')).toHaveCount(0);
    await page.screenshot({ path: `${CAPTURAS}/hu-001-ca5-cierre.png`, fullPage: true });
  });

  test('CA-5 · cerrar sesión no afecta a otras sesiones del mismo usuario', async ({
    page,
    browser,
  }) => {
    await page.goto('/login');
    await ingresar(page, CUENTAS.administradora.correo);
    await expect(page).toHaveURL(/\/dashboard$/);

    const otroNavegador = await browser.newContext();
    const otraPagina = await otroNavegador.newPage();
    await otraPagina.goto('/login');
    await ingresar(otraPagina, CUENTAS.administradora.correo);
    await expect(otraPagina).toHaveURL(/\/dashboard$/);

    await page.getByTestId('btn-cerrar-sesion').click();
    await expect(page).toHaveURL(/\/login$/);

    await otraPagina.goto('/polizas');
    await expect(otraPagina).toHaveURL(/\/polizas$/);
    await otroNavegador.close();
  });
});
