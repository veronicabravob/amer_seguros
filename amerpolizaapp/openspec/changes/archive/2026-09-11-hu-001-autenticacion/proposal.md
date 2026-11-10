# HU-001 — Autenticación de usuario

## Why

El prototipo abre directamente en `/dashboard` y muestra un usuario fijo escrito en el código
("Laura Gómez · Asesora comercial" en `app/src/components/layout/Sidebar.tsx`). Sin identidad real
no hay atribución de cambios, no hay permisos y no hay separación de datos por agencia: cualquier
módulo que se construya encima habría que rehacerlo. Además no existe todavía la carpeta `api/`,
así que este cambio es el que pone en pie el backend con el que hablarán todas las HU siguientes.

Es la primera HU del backlog (E0) y bloquea al resto.

## What Changes

- **Backend nuevo (`api/`)**: proyecto Django + Django Ninja con `config/settings/{base,dev}.py`,
  base de datos, `apps/core` (modelo base auditable) y `apps/usuarios`.
- **Modelo de usuario** con correo como identificador, contraseña con hash, rol, sede y estado
  (`Activo` / `Inactivo`).
- **Tres endpoints de sesión**: `POST /api/auth/login`, `POST /api/auth/logout`,
  `GET /api/auth/me`.
- **Sesión con JWT + registro de sesiones revocables**: el token se firma, pero cada `jti` tiene
  fila propia para poder caducar por inactividad (RN-3) e invalidarse al cerrar sesión (CA-5).
- **El token viaja en cookie `HttpOnly`**, no en `localStorage`; en desarrollo el `/api` se sirve
  por el proxy de Vite para que todo quede en el mismo origen.
- **Bloqueo por intentos fallidos**: 5 intentos consecutivos del mismo correo en 15 minutos
  bloquean el ingreso durante 15 minutos.
- **Respuesta 401 por defecto** en todo el API: el router sólo se expone con `auth=`, salvo
  `/api/auth/login`.
- **Pantalla de ingreso nueva** en `/login`, construida sólo con clases que ya existen
  (`.side`, `.card`, `.fgrid`, `.field`, `.lbl`, `.req`, `.inp`, `.hint`, `.btn.btn-pri`).
- **Protección de todas las rutas de la SPA**: sin sesión se redirige a `/login` y, tras ingresar,
  se vuelve a la ruta que se había pedido.
- **BREAKING** — `app/src/App.tsx` deja de redirigir la raíz a `/dashboard` sin condiciones, y el
  pie de `Sidebar.tsx` deja de tener el nombre y el rol escritos en el código: pasan a venir de
  `GET /api/auth/me`.
- **Semilla (`manage.py seed`)** con una cuenta por rol y una cuenta inactiva para poder probar
  CA-3, con contraseñas ficticias documentadas en `docs/DATOS.md`.

## Capabilities

### New Capabilities
- `autenticacion`: ingreso con correo y contraseña, emisión y validación del token de sesión,
  bloqueo de cuentas inactivas y de intentos repetidos fallidos, protección de rutas de la SPA y
  de los endpoints del API, y cierre de sesión con invalidación del token.

### Modified Capabilities
<!-- Ninguna: `openspec/specs/` está vacío; ésta es la primera capacidad del proyecto. -->

## Impact

**Código nuevo**
- `api/` completo: `manage.py`, `pyproject.toml`, `config/`, `apps/core/`, `apps/usuarios/`
  (`models.py`, `schemas.py`, `services.py`, `api.py`, `tests/`).
- `app/src/pages/auth/LoginPage.tsx`, `app/src/context/SesionContext.tsx`,
  `app/src/components/auth/RutaProtegida.tsx`, `app/src/api/client.ts`.
- `e2e/specs/hu-001-autenticacion.spec.ts` y la configuración de Playwright.

**Código modificado**
- `app/src/App.tsx`: ruta pública `/login` y el resto del árbol detrás de `RutaProtegida`.
- `app/src/components/layout/Sidebar.tsx`: nombre, iniciales y rol desde la sesión, y acción de
  cerrar sesión.
- `app/src/styles/global.css`: clases del contenedor de la pantalla de ingreso, siguiendo la
  nomenclatura corta existente y sólo con `var(--token)`.
- `app/vite.config.ts`: proxy de `/api` hacia el backend.
- `app/package.json`: Vitest y `@playwright/test` para el gate de entrega.
- `docs/DATOS.md`: cuentas y contraseñas ficticias de la semilla.

**Dependencias nuevas**
- Backend: `django`, `django-ninja`, `pyjwt`, `argon2-cffi`, `pytest-django`, `ruff`.
- Frontend: ninguna librería de UI; sólo herramientas de prueba.

**No se toca**
- `app/src/data/mockData.ts` sigue alimentando las pantallas existentes: este cambio sólo mueve la
  identidad del usuario al backend, no los datos de pólizas ni de clientes.

**Riesgo declarado en el backlog (E0)**: el manejo del token en el frontend. Se resuelve en
`design.md` con cookie `HttpOnly` + proxy de mismo origen.
