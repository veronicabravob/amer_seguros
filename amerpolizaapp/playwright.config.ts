import { defineConfig, devices } from '@playwright/test';

/**
 * Pruebas funcionales end-to-end de AMER Pólizas.
 *
 * Levanta el API y la SPA, y entra por el mismo origen (el proxy de Vite) para que la
 * cookie de sesión viaje igual que en el navegador de una persona.
 */

const PUERTO_SPA = 5180;
const PUERTO_API = 8010;
const SEGUNDOS_BLOQUEO = 20;
export const URL_BASE = `http://localhost:${PUERTO_SPA}`;

export default defineConfig({
  testDir: './e2e/specs',
  outputDir: './e2e/evidencia/resultados',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'e2e/evidencia/reporte', open: 'never' }],
  ],
  use: {
    baseURL: URL_BASE,
    // Evidencia obligatoria del gate de entrega.
    video: 'on',
    screenshot: 'on',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      // Base de datos nueva en cada corrida: así el bloqueo de RN-2 de una corrida
      // anterior no se filtra a la siguiente.
      command: `uv run python -c "import pathlib; pathlib.Path('db.e2e.sqlite3').unlink(missing_ok=True)" && uv run python manage.py migrate --noinput && uv run python manage.py seed && uv run python manage.py runserver 127.0.0.1:${PUERTO_API} --noreload`,
      cwd: 'api',
      url: `http://127.0.0.1:${PUERTO_API}/api/docs`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        AMER_DB: 'e2e',
        // La ventana real de RN-2 son 15 minutos (base.py, fijada por las pruebas
        // unitarias). Aquí se acorta para poder comprobar que el bloqueo vence.
        AMER_VENTANA_BLOQUEO_SEGUNDOS: String(SEGUNDOS_BLOQUEO),
      },
    },
    {
      command: `npm run dev -- --port ${PUERTO_SPA} --strictPort`,
      cwd: 'app',
      url: URL_BASE,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        AMER_API_PUERTO: String(PUERTO_API),
        AMER_VENTANA_BLOQUEO_SEGUNDOS: String(SEGUNDOS_BLOQUEO),
      },
    },
  ],
});
