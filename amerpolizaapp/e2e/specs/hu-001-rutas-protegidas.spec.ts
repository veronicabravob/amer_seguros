/**
 * HU-001 — "Ninguna ruta de la SPA es alcanzable sin sesión".
 *
 * Es la comprobación explícita que pide la HU, aparte de los escenarios de la spec: recorre
 * todas las rutas declaradas en `app/src/App.tsx` y exige que ninguna se abra sin sesión.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Todas las rutas protegidas de la aplicación. */
const RUTAS = [
  '/',
  '/dashboard',
  '/polizas',
  '/polizas/nueva',
  '/polizas/P-001',
  '/clientes',
  '/clientes/nuevo',
  '/clientes/C01',
  '/configuracion',
  '/configuracion/usuarios',
  '/configuracion/usuarios/nuevo',
  '/configuracion/sedes',
  '/configuracion/vendedores',
  '/configuracion/vendedores/nuevo',
  '/configuracion/afiliacion',
  '/configuracion/aseguradoras',
  '/configuracion/aseguradoras/nueva',
  '/configuracion/ramos',
  '/configuracion/ramos/nuevo',
  '/configuracion/coberturas',
  '/configuracion/motivos',
  '/configuracion/siniestros',
  '/una-ruta-que-no-existe',
];

test.describe('Ninguna pantalla es alcanzable sin sesión', () => {
  for (const ruta of RUTAS) {
    test(`@regresion sin sesión, ${ruta} lleva a /login`, async ({ page }) => {
      await page.goto(ruta);

      await expect(page).toHaveURL(/\/login$/);
      await expect(page.getByTestId('login-enviar')).toBeVisible();
      // Ni rastro del marco de la aplicación.
      await expect(page.getByTestId('side-usuario')).toHaveCount(0);
    });
  }

  test('la lista de rutas de esta prueba cubre todas las de App.tsx', () => {
    const app = readFileSync(path.join(RAIZ, 'app', 'src', 'App.tsx'), 'utf-8');
    const declaradas = [...app.matchAll(/path="([^"]+)"/g)]
      .map((m) => m[1])
      .filter((p) => p !== 'login' && p !== '*' && !p.startsWith(':'));

    // Cada segmento declarado aparece en alguna de las rutas que se recorren arriba.
    const recorridas = RUTAS.join(' ');
    const sinCubrir = declaradas.filter((segmento) => !recorridas.includes(segmento));

    expect(sinCubrir, `Rutas de App.tsx sin comprobar: ${sinCubrir.join(', ')}`).toEqual([]);
  });
});
