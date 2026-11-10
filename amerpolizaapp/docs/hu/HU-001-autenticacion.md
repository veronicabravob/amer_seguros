# HU-001 — Autenticación de usuario

|  |  |
|---|---|
| **Épica** | E0 — Fundación técnica y acceso |
| **Prioridad** | Must — bloquea todo lo demás |
| **Depende de** | — |

## Historia

**Como** persona del equipo de la agencia
**quiero** ingresar con mi correo y contraseña
**para** acceder sólo a la información de mi agencia y que cada cambio quede atribuido a mí.

## Contexto en el prototipo

El prototipo abre directamente en `/dashboard` y muestra fijo "Laura Gómez · Asesora comercial"
en el pie de la barra lateral (`app/src/components/layout/Sidebar.tsx`). No existe pantalla de
ingreso: esta HU la crea.

## Criterios de aceptación

### CA-1 — Ingreso con credenciales válidas
**CUANDO** un usuario activo envía correo y contraseña correctos
**ENTONCES** el sistema devuelve un token de sesión, redirige a `/dashboard` y la barra lateral
muestra el nombre y el rol reales del usuario autenticado.

### CA-2 — Credenciales inválidas
**CUANDO** el correo no existe o la contraseña no coincide
**ENTONCES** el sistema muestra "Correo o contraseña incorrectos", no revela cuál de los dos falló
y no crea sesión.

### CA-3 — Usuario inactivo
**CUANDO** las credenciales son correctas pero la cuenta está en estado `Inactivo`
**ENTONCES** el sistema niega el ingreso con el mensaje "Tu cuenta está inactiva, contacta al administrador".

### CA-4 — Ruta protegida sin sesión
**CUANDO** alguien abre `/polizas` sin sesión válida
**ENTONCES** el sistema redirige a `/login` y, después de un ingreso exitoso, lleva a la ruta solicitada.

### CA-5 — Cierre de sesión
**CUANDO** el usuario cierra sesión
**ENTONCES** el token queda invalidado y volver atrás en el navegador no muestra datos de la agencia.

## Reglas de negocio

- RN-1 — La contraseña se almacena con hash (nunca en texto plano) y exige mínimo 8 caracteres.
- RN-2 — Tras 5 intentos fallidos consecutivos del mismo correo, se bloquea el intento por 15 minutos.
- RN-3 — El token expira a las 8 horas de inactividad.
- RN-4 — Toda petición a la API sin token válido responde 401.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | `{correo, password}` → `{token, usuario}` |
| POST | `/api/auth/logout` | Invalida el token actual |
| GET | `/api/auth/me` | Datos del usuario autenticado |

## Hecho cuando

- [ ] Unitarias: hash de contraseña, expiración, bloqueo por intentos, usuario inactivo.
- [ ] E2E `e2e/hu-001-autenticacion.spec.ts`: CA-1 a CA-5 con video y captura.
- [ ] Ninguna ruta de la SPA es alcanzable sin sesión.
