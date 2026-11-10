# AMER Pólizas — aplicación web

SPA en React 19 + TypeScript + Vite. El diseño no se inventa: se reutiliza el inventario de
`docs/DESIGN-SYSTEM.md`.

## Levantar el entorno

La aplicación necesita el backend: desde HU-001 no hay ninguna pantalla accesible sin sesión.

```bash
# Terminal 1 — API
cd api && uv run python manage.py migrate && uv run python manage.py seed
uv run python manage.py runserver 127.0.0.1:8000

# Terminal 2 — SPA
cd app && npm install && npm run dev
```

Se entra por la dirección que imprime Vite (`http://localhost:5173`), **no** por el puerto del
backend. Las cuentas de demostración y su contraseña están en `docs/DATOS.md`.

### Por qué se pasa siempre por el proxy

El token de sesión viaja en una cookie `HttpOnly` (ver `design.md` del cambio
`hu-001-autenticacion`). `vite.config.ts` proxya `/api` hacia `http://127.0.0.1:8000`, de modo
que la SPA y el API quedan en el mismo origen: la cookie es de primera parte, no hace falta
CORS con credenciales y no hay CSRF entre sitios.

Si se llama al backend por su puerto directo (`http://127.0.0.1:8000/api/...`) desde el
navegador, **la cookie no viaja** y todo responde `401`. En producción la SPA y el API se
sirven bajo el mismo dominio, por la misma razón.

## Comandos

| Comando | Para qué |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Comprobación de tipos y compilación a `dist/` |
| `npm run lint` | Oxlint |
| `npm run test:unit` | Pruebas unitarias con Vitest |
| `npm run test:unit:watch` | Vitest en modo vigilancia |

Las pruebas funcionales end-to-end viven en `e2e/` y se corren con Playwright
(`npx playwright test`).

## Estructura

```
src/
  api/          Cliente único del API y llamadas de sesión
  components/
    auth/       Puerta de las rutas protegidas
    layout/     AppShell, barra lateral y barra superior
    ui/         Componentes reutilizables (Chips, Modal, StatusBadge, Switch, Tabs)
  context/      Estado compartido (sesión, búsqueda)
  data/         Datos simulados y anonimizados del prototipo
  pages/        Una carpeta por módulo del negocio
  styles/       global.css — tokens y clases del sistema de diseño
```
