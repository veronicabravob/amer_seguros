import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Playwright levanta el API en otro puerto para no pisar el entorno de desarrollo.
const PUERTO_API = process.env.AMER_API_PUERTO ?? '8000'

export default defineConfig({
  plugins: [react()],
  server: {
    // El API se sirve por el mismo origen que la SPA para que la cookie de sesión
    // (HttpOnly) viaje como cookie de primera parte: sin CORS con credenciales y sin
    // CSRF entre sitios. Ver design.md D2 del cambio hu-001-autenticacion.
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${PUERTO_API}`,
        changeOrigin: false,
      },
    },
  },
})
