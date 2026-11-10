---
name: pruebas-e2e-playwright
description: Cómo se derivan y escriben las pruebas funcionales end-to-end con Playwright a partir de los escenarios de las specs de OpenSpec y de los criterios de aceptación de las HU. Úsala al cerrar cualquier feature o épica, y siempre que agregues o cambies comportamiento visible en la interfaz. Incluye evidencia en video y capturas y la suite de regresión.
---

# Pruebas funcionales con Playwright

## Principio

**Un `#### Scenario` de la spec = un `test()` de Playwright.** No se inventan escenarios nuevos ni
se omiten los que están escritos: la spec es la fuente de verdad y la prueba es su verificación.

## Estructura

```
e2e/
├── fixtures/          # sesión autenticada, datos sembrados
├── pages/             # page objects, uno por pantalla
├── specs/             # hu-XXX-<slug>.spec.ts
└── evidencia/         # videos y capturas (no se versiona)
```

## Cómo se escribe una prueba

```ts
// e2e/specs/hu-012-listar-polizas.spec.ts
import { test, expect } from '@playwright/test';

test.describe('HU-012 — Listar pólizas con filtros y vistas', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/polizas'); });

  test('CA-2 · el chip "Por vencer" deja sólo pólizas que vencen en 30 días', async ({ page }) => {
    await page.getByTestId('chip-vencer').click();
    const filas = page.getByTestId('poliza-fila');
    await expect(filas).not.toHaveCount(0);
    for (const fila of await filas.all()) {
      await expect(fila.getByTestId('poliza-estado')).toHaveText('Por vencer');
    }
    await page.screenshot({ path: 'e2e/evidencia/hu-012-ca2.png', fullPage: true });
  });
});
```

Reglas:

- El título del `test()` empieza con el identificador del criterio (`CA-2 · …`).
- Selectores por `getByTestId`, `getByRole` o `getByLabel`. **Nunca** por clase CSS ni por XPath.
- Nada de `waitForTimeout`: se espera por el estado con `expect(...).toBeVisible()`.
- Cada prueba es independiente y puede correr en paralelo: siembra sus propios datos.

## Evidencia (obligatoria)

En `playwright.config.ts`:

```ts
use: {
  baseURL: 'http://localhost:5173',
  video: 'on',                    // video de cada prueba
  screenshot: 'on',               // captura al final de cada prueba
  trace: 'retain-on-failure',
},
reporter: [['list'], ['html', { outputFolder: 'e2e/evidencia/reporte', open: 'never' }]],
outputDir: 'e2e/evidencia/artifacts',
```

Al cerrar una épica se adjunta al PR el enlace del reporte HTML y los videos de los escenarios
principales.

## Suite de regresión

- Etiqueta: los escenarios estables se marcan `test('@regresion CA-1 · …')`.
- Comando: `npx playwright test --grep @regresion`.
- La regresión completa corre **al cerrar cada feature y cada épica**, no sólo la suite nueva.
  Si una prueba de otra épica se rompe, se arregla antes de continuar: eso es precisamente
  para lo que existe la suite.

## Comandos

| Para | Comando |
|---|---|
| Todo | `npx playwright test` |
| Una HU | `npx playwright test e2e/specs/hu-014-crear-poliza.spec.ts` |
| Regresión | `npx playwright test --grep @regresion` |
| Ver el reporte | `npx playwright show-report e2e/evidencia/reporte` |
| Depurar | `npx playwright test --ui` |
| Grabar una prueba nueva | `npx playwright codegen http://localhost:5173` |
