## Context

Ver `proposal.md` — *Why* para la motivación. Lo que condiciona el diseño:

- **No existe `api/`.** Esta HU levanta el backend desde cero, así que además de la autenticación
  hay que dejar sentadas las bases que reutilizarán las 29 HU siguientes: `apps/core` con el modelo
  auditable, el manejador de errores y el patrón `models / schemas / services / api` de la skill
  `backend-django-ninja`.
- **El frontend es una SPA de Vite** (React 19 + React Router 7) que hoy vive sola en el puerto de
  Vite y se alimenta de `app/src/data/mockData.ts`. No hay ninguna llamada HTTP todavía: este cambio
  crea el primer cliente de API.
- **El diseño no se inventa** (`docs/DESIGN-SYSTEM.md`). La pantalla de ingreso es la primera
  pantalla nueva del proyecto y sirve de precedente para todas las demás.
- **Reglas de negocio que el diseño debe sostener**: RN-1 hash y mínimo 8 caracteres, RN-2 bloqueo
  por 5 intentos en 15 minutos, RN-3 caducidad a las 8 horas de **inactividad**, RN-4 `401` sin
  token válido.
- **Riesgo declarado en el backlog (E0)**: dónde vive el token en el frontend.

## Goals / Non-Goals

**Goals**

- Un único punto de verdad de la sesión en el backend, para que HU-019 (usuarios) y HU-020
  (permisos) se apoyen en él sin rehacerlo.
- Que un XSS en la SPA no pueda leer el token.
- Que las pruebas E2E puedan preparar una sesión sin rodeos frágiles.
- Dejar el esqueleto de `api/` en el estado que describe la skill `backend-django-ninja`.

**Non-Goals**

- Matriz de permisos por módulo: aquí sólo existe "con sesión / sin sesión" (HU-020).
- Recuperación y cambio de contraseña, registro autónomo, doble factor y SSO.
- Refresco silencioso con dos tokens, gestión de dispositivos y cierre remoto de sesiones.
- Multi-agencia real: el filtro por agencia se declara como convención en `services.py`, pero los
  módulos que lo consumen llegan después.

## Decisions

### D1 — JWT firmado con registro de sesiones revocables

**Decisión (tomada por el equipo).** El token es un JWT `HS256` con `sub` (id del usuario), `jti`
(identificador de la sesión), `iat` y `exp`. Además, cada `jti` tiene una fila en `SesionToken`
(`jti`, `usuario`, `creado_en`, `ultimo_uso`, `revocado_en`, `user_agent`).

Validar una petición es: verificar firma y `exp` → buscar el `jti` → rechazar si está revocado, si
el usuario pasó a `Inactivo`, o si `ultimo_uso` tiene más de 8 horas → si pasa, actualizar
`ultimo_uso`.

*Por qué así:* el JWT solo no cubre dos requisitos de la HU. RN-3 mide **inactividad**, no vigencia
absoluta, y CA-5 exige que el token quede inservible al cerrar sesión; un JWT puro no se invalida.
La fila por `jti` resuelve ambos.

*Compromiso que hay que asumir y dejar escrito:* con esta tabla el JWT deja de ser
autocontenido —cada petición consulta la base de datos igual que un token opaco—, así que no
aporta la ventaja que suele justificarlo. Se mantiene porque es la opción elegida y porque la firma
permite descartar tokens basura sin tocar la base de datos. *Alternativa descartada:* token opaco
aleatorio sobre la misma tabla, que habría dado el mismo comportamiento con menos piezas.

*Detalles:*
- `exp` absoluto de 8 horas desde la emisión; se reemite la cookie cuando al JWT le queda menos de
  1 hora y la sesión sigue activa, de modo que la caducidad efectiva es la inactividad de RN-3.
- `ultimo_uso` se escribe con amortiguación: sólo si han pasado más de 60 segundos desde la última
  escritura, para no hacer un `UPDATE` por cada petición.
- Secreto de firma en `DJANGO_SECRET_KEY` por variable de entorno, nunca en el repositorio.
- Una tarea de limpieza (`manage.py purgar_sesiones`) borra filas revocadas o caducadas hace más
  de 30 días. En esta HU basta con el comando; no se programa.

### D2 — El token viaja en cookie `HttpOnly`, con el API en el mismo origen

**Decisión.** `Set-Cookie: sesion=<jwt>; HttpOnly; SameSite=Lax; Path=/; Secure` (`Secure` sólo
fuera de desarrollo). En desarrollo, `app/vite.config.ts` proxya `/api` al backend, así que el
navegador ve un solo origen.

*Por qué así:* resuelve el riesgo del backlog. Con `HttpOnly` el JavaScript de la SPA no puede leer
el token, de modo que un XSS no lo exfiltra. Con el mismo origen no hay CORS con credenciales ni
CSRF entre sitios, y `SameSite=Lax` cubre el resto.

*Alternativa descartada:* `localStorage` + `Authorization: Bearer`. Es más simple de depurar y es el
patrón habitual de Django Ninja, pero deja el token al alcance de cualquier script inyectado.

*Consecuencias:*
- El autenticador de Django Ninja lee la cookie; también acepta `Authorization: Bearer` para poder
  probar el API desde `/api/docs` y desde las pruebas de integración.
- `fetch` se llama siempre con `credentials: 'include'`.
- La SPA no sabe si hay sesión mirando el almacenamiento: lo averigua llamando a `GET /api/auth/me`
  al arrancar. Mientras esa llamada está en vuelo, `SesionContext` está en estado `cargando` y no
  se decide ninguna redirección (si no, se vería un parpadeo hacia `/login` en cada recarga).
- En producción la SPA se sirve detrás del mismo dominio que el API. Queda anotado como requisito
  de despliegue.

### D3 — Bloqueo por intentos: contador por correo

**Decisión.** Tabla `IntentoIngreso` (`correo_normalizado`, `exito`, `creado_en`, `ip`). Antes de
verificar la contraseña se cuentan los intentos fallidos de ese correo posteriores al último éxito
y dentro de los últimos 15 minutos; con 5 o más, `429`.

*Por qué así:* es literalmente lo que dice RN-2, es determinista y se prueba sin depender de la IP
del entorno de pruebas. La `ip` se guarda sólo para diagnóstico, no entra en la decisión.

*Riesgo aceptado:* alguien puede bloquear a propósito la cuenta de otra persona 15 minutos. Se
asume para esta HU; si aparece en operación, se añade un segundo contador por IP en una HU nueva.

### D4 — Contraseñas y usuario

- Hash con **Argon2** (`argon2-cffi`), el hasher recomendado por Django, configurado primero en
  `PASSWORD_HASHERS`.
- Mínimo 8 caracteres, validado en el modelo y en los servicios que crean o cambian contraseñas
  (aquí sólo la semilla; el alta de usuarios es HU-019).
- `Usuario` hereda de `AbstractBaseUser` + `PermissionsMixin` con `USERNAME_FIELD = "correo"`
  (`EmailField`, único, guardado en minúsculas). Campos del dominio: `nombre`, `rol`, `sede`,
  `estado` (`Activo` / `Inactivo`).
- Se declara `AUTH_USER_MODEL` desde la primera migración: cambiarlo después es caro.
- `rol` y `sede` son campos de texto con opciones fijas en esta HU. HU-007 (sedes) y HU-020 (roles)
  los convertirán en relaciones; la migración es pequeña y no justifica adelantar esas HU aquí.

### D5 — Respuestas del API

Un manejador de excepciones traduce las reglas de negocio a `{codigo, mensaje, campo}` según la
skill `backend-django-ninja`:

| Situación | Código | `codigo` | Mensaje |
|---|---|---|---|
| Credenciales inválidas | `401` | `credenciales_invalidas` | Correo o contraseña incorrectos |
| Cuenta inactiva | `403` | `cuenta_inactiva` | Tu cuenta está inactiva, contacta al administrador |
| Bloqueo por intentos | `429` | `demasiados_intentos` | Demasiados intentos. Intenta de nuevo en 15 minutos |
| Sin token válido | `401` | `sin_sesion` | Sesión no válida |
| Formato de entrada inválido | `422` | — | (validación de Ninja) |

Para no filtrar por tiempo si un correo existe (spec: *Rechazo de credenciales inválidas*), cuando
el correo no existe se verifica igualmente el hash contra un valor ficticio antes de responder.

### D6 — Protección de rutas en la SPA

- `SesionContext` (`app/src/context/SesionContext.tsx`) expone `{usuario, cargando, ingresar,
  cerrarSesion}` y llama a `GET /api/auth/me` al montar.
- `RutaProtegida` envuelve el `AppShell` en `App.tsx`: si `cargando`, no pinta nada; si no hay
  usuario, `<Navigate to="/login" state={{ desde: location }} replace />`. `LoginPage` lee
  `state.desde` y redirige ahí tras ingresar; si no hay, a `/dashboard` (CA-4).
- El cliente de API (`app/src/api/client.ts`) centraliza `fetch`: ante un `401` limpia la sesión del
  contexto y lleva a `/login`, de modo que la desactivación de la cuenta o la caducidad se notan sin
  código repetido en cada pantalla.
- `Sidebar.tsx` deja de tener el usuario escrito en el código: nombre, iniciales y rol salen del
  contexto, y el pie gana el botón de cerrar sesión.
- CA-5 ("volver atrás no muestra datos"): la navegación de vuelta la resuelve React Router en
  memoria, así que basta con que el contexto ya no tenga usuario. Además, las respuestas del API se
  envían con `Cache-Control: no-store`.

### D7 — Reutilización visual de la pantalla de ingreso

Pantalla nueva, así que aplica la regla 2.4 de la guía. Nada de esto es diseño nuevo:

| Zona | Qué se reutiliza |
|---|---|
| Panel izquierdo | El mismo degradado de `.side` y el logo `public/assets/amer-logo-white.png` con `.brandbar` / `.brand-logo` |
| Tarjeta del formulario | `.card` (radio 14 px, borde `var(--line)`) |
| Campos | `.fgrid` (a una sola columna con `.field.full`), `.field`, `.lbl`, `.req`, `.inp`, `.hint` |
| Botón de ingreso | `.btn.btn-pri` (alto 38 px, radio 10 px) |
| Tipografía | `.h1` para el título y `.psub` para el subtítulo |
| Error | Colores `var(--red)` / `var(--red-t)`, los mismos de `.st-vencida` |

Clases nuevas en `global.css`, con la nomenclatura corta existente y sólo `var(--token)`:
`.login-wrap` (dos columnas, una sola en pantallas angostas), `.login-hero` (el panel del
degradado), `.login-box` (ancho máximo de la tarjeta) y `.login-err` (la franja del mensaje de
error). El degradado se declara una sola vez y `.side` y `.login-hero` lo comparten.

`data-testid` obligatorios: `login-correo`, `login-password`, `login-enviar`, `login-error`, y
`side-usuario` / `btn-cerrar-sesion` en la barra lateral.

### D8 — Semilla

`manage.py seed` crea una cuenta por cada rol que ya aparece en `app/src/data/mockData.ts`, más la
cuenta inactiva que hace falta para CA-3:

| Correo | Rol | Sede | Estado |
|---|---|---|---|
| `laura.gomez@amerseguros.com` | Administrador | Duitama | Activo |
| `carlos.rincon@amerseguros.com` | Asesor comercial | Tunja | Activo |
| `julian.castro@amerseguros.com` | Cobros | Duitama | Activo |
| `paula.ruiz@amerseguros.com` | Recepción | Duitama | **Inactivo** |

Contraseña ficticia común (`Amer2026*demo`), documentada en `docs/DATOS.md`. La semilla es
idempotente y sólo se permite fuera de producción. Son datos ficticios, coherentes con la política
de `docs/DATOS.md`.

## Risks / Trade-offs

- **El JWT consulta la base de datos en cada petición** → Asumido a conciencia (D1). El coste es un
  `SELECT` por `jti` indexado y un `UPDATE` amortiguado a uno por minuto; si algún día estorba, se
  cambia el almacén de `SesionToken` a caché sin tocar la spec.
- **Cookie `HttpOnly` con la SPA en otro puerto durante el desarrollo** → El proxy `/api` de Vite
  deja todo en el mismo origen; si alguien salta el proxy y llama al backend por su puerto directo,
  la cookie no viaja. Queda escrito en `app/README.md` y en la configuración de Playwright.
- **Producción exige mismo dominio para SPA y API** → Se anota como requisito de despliegue en el
  README; si no se cumpliera, habría que volver a `Authorization: Bearer` y reabrir D2.
- **Bloqueo malicioso de una cuenta ajena** → Riesgo aceptado en D3 durante 15 minutos, con salida
  conocida (contador por IP en una HU nueva).
- **`rol` y `sede` como texto** → Se migran a relaciones en HU-007 y HU-020; se aíslan en el esquema
  de salida para que el cambio no toque a quien los consume.
- **Cambiar `AUTH_USER_MODEL` más adelante es caro** → Por eso entra en la primera migración.
- **Este cambio arrastra el arranque de todo el backend** → Es más trabajo del que sugiere "hacer un
  login", pero es inevitable: no hay `api/`. Las tareas lo separan en un bloque propio para que se
  vea qué es infraestructura y qué es autenticación.

## Migration Plan

No hay datos previos ni usuarios en producción: es la primera puesta en marcha.

1. `api/`: crear el proyecto, `AUTH_USER_MODEL` y la migración inicial, y ejecutar `manage.py seed`.
2. Frontend: publicar `/login`, `SesionContext` y `RutaProtegida` en el mismo despliegue que el
   backend; si se publicara antes, toda la aplicación quedaría inaccesible.
3. Vuelta atrás: revertir el despliegue del frontend deja la SPA como está hoy, abierta y con datos
   simulados. El backend puede quedarse en pie sin efectos.

## Open Questions

- Duración de la limpieza de `SesionToken` (los 30 días de D1 son una cifra de partida) y si el
  comando se programa. No afecta a la spec ni a las tareas.
- Si la reemisión de la cookie debe renovar también el `jti` (rotación) o sólo el `exp`. Se resuelve
  al implementar; ambas cumplen la spec.
