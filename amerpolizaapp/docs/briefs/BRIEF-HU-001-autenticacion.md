# Brief — HU-001 · Autenticación de usuario

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-001-autenticacion` |
| **HU fuente** | `docs/hu/HU-001-autenticacion.md` |
| **Épica** | E0 — Fundación y acceso |
| **Prioridad** | Must — bloquea todo lo demás |
| **Depende de** | — |
| **Capacidad** | `autenticacion` (ADDED) |

## Intención

Hoy el prototipo abre directo en `/dashboard` con un usuario fijo escrito en el código
("Laura Gómez · Asesora comercial" en `Sidebar.tsx`). Sin identidad real no hay atribución de
cambios, no hay permisos y no hay separación de datos por agencia: todo lo que se construya
encima habría que rehacerlo. Este cambio introduce la sesión: pantalla de ingreso, token,
protección de rutas y cierre de sesión.

## Alcance

- Pantalla de ingreso nueva en el frontend, construida con el sistema de diseño existente.
- Autenticación contra el backend con correo y contraseña, y emisión de token de sesión.
- Bloqueo de cuentas inactivas y de intentos repetidos fallidos.
- Protección de todas las rutas de la SPA y de todos los endpoints del API.
- Cierre de sesión con invalidación del token.

## Fuera de alcance

- Recuperación y cambio de contraseña (no está en la HU; si se necesita, se propone como HU nueva).
- Registro autónomo de usuarios: las cuentas las crea un administrador (HU-019).
- Doble factor, SSO y sesiones concurrentes por dispositivo.
- Matriz fina de permisos por módulo: aquí sólo "con sesión / sin sesión" (HU-020).

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Ingreso con credenciales válidas | Credenciales correctas de usuario activo |
| CA-2 | Rechazo de credenciales inválidas | Correo inexistente o contraseña incorrecta |
| CA-3 | Bloqueo de cuenta inactiva | Credenciales correctas con cuenta inactiva |
| CA-4 | Protección de rutas | Acceso a `/polizas` sin sesión y retorno a la ruta pedida |
| CA-5 | Cierre de sesión | Token invalidado y vuelta atrás sin datos |
| RN-2 | Bloqueo por intentos fallidos | 5 intentos fallidos del mismo correo en 15 minutos |

## Reglas para el `design.md`

- RN-1 — Contraseña con hash, nunca en texto plano; mínimo 8 caracteres.
- RN-2 — 5 intentos fallidos consecutivos del mismo correo bloquean 15 minutos.
- RN-3 — El token expira a las 8 horas de inactividad.
- RN-4 — Toda petición sin token válido responde 401.
- El mensaje de error no revela si falló el correo o la contraseña.
- Decidir y documentar dónde vive el token en el frontend (es el riesgo señalado en el backlog).

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | `{correo, password}` → `{token, usuario}` |
| POST | `/api/auth/logout` | Invalida el token actual |
| GET | `/api/auth/me` | Datos del usuario autenticado |

## Reutilización visual

Pantalla nueva: exige la sección **Reutilización visual** en el `design.md` (regla 2.4 de la guía).

- Referencia: degradado de `.side` y logo `public/assets/amer-logo-white.png`.
- Formulario: `.card`, `.fgrid`, `.field`, `.lbl`, `.req`, `.inp`, `.hint`, `.btn.btn-pri`.
- Sólo variables CSS, ningún color literal, ninguna librería de UI nueva.
- `data-testid` en correo, contraseña, botón de ingreso y mensaje de error.

## Verificación

- Unitarias: hash de contraseña, expiración del token, bloqueo por intentos, cuenta inactiva.
- E2E `e2e/specs/hu-001-autenticacion.spec.ts`: un `test()` por escenario, con video y captura.
- Comprobación explícita: ninguna ruta de la SPA es alcanzable sin sesión.

## Decisiones abiertas

1. **Mecanismo del token**: ¿token opaco en base de datos o JWT? La expiración por *inactividad*
   (RN-3) favorece el token en base de datos con renovación; un JWT puro no se invalida al cerrar
   sesión, lo que choca con CA-5.
2. **Dónde se guarda en el frontend**: cookie `HttpOnly` frente a `localStorage`. Afecta a CORS,
   CSRF y a cómo Playwright prepara la sesión.
3. **Contador de intentos fallidos**: ¿por correo, por IP o por ambos? La HU dice "del mismo correo".
4. **Usuarios de la semilla**: qué cuentas crea `manage.py seed` para pruebas y demo (mínimo una
   por rol, con contraseñas ficticias documentadas en `docs/DATOS.md`).

## Prompt de arranque

```
/opsx:new hu-001-autenticacion
```

```
El brief de este cambio es docs/briefs/BRIEF-HU-001-autenticacion.md y la fuente completa es
docs/hu/HU-001-autenticacion.md. Léelos junto con docs/DESIGN-SYSTEM.md y las skills diseno-amer
y backend-django-ninja. Antes de escribir la propuesta, responde las cuatro decisiones abiertas
del brief y dime qué clases existentes usarás para la pantalla de ingreso.
```
