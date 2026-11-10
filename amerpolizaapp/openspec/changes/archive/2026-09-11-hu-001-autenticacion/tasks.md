## 1. Arranque del backend (`api/`)

- [x] 1.1 Crear el proyecto Django con `pyproject.toml` (django, django-ninja, pyjwt, argon2-cffi, pytest-django, ruff) y `config/settings/{base,dev}.py`; verificar que `python manage.py check` termina sin errores
- [x] 1.2 Crear `apps/core` con `ModeloAuditable` (creado_por, creado_en, actualizado_por, actualizado_en) y la excepción `ReglaDeNegocio`; verificar con una prueba que el modelo base estampa fechas al guardar
- [x] 1.3 Registrar el *exception handler* que traduce `ReglaDeNegocio` a `409 {codigo, mensaje, campo}` y la validación de entrada a `422`; verificar con pruebas de ambos códigos
- [x] 1.4 Montar la instancia de Ninja en `config/urls.py` bajo `/api` con el autenticador exigido por defecto; verificar que `/api/docs` responde y que un endpoint de prueba sin token devuelve `401`
- [x] 1.5 Configurar `ruff` y `pytest-django` (`pytest.ini` / `pyproject.toml`); verificar que `ruff check .` y `pytest -q` corren en verde sobre el esqueleto

## 2. Modelo de usuario y sesión

- [x] 2.1 Crear `apps/usuarios/models.py` con `Usuario` (`AbstractBaseUser` + `PermissionsMixin`, `USERNAME_FIELD = "correo"`, campos `nombre`, `rol`, `sede`, `estado`) y su *manager*; verificar con una prueba que el correo se guarda normalizado en minúsculas y que es único sin distinguir mayúsculas
- [x] 2.2 Declarar `AUTH_USER_MODEL` y configurar Argon2 primero en `PASSWORD_HASHERS`; verificar con una prueba que la contraseña guardada no es el texto plano y que `check_password` la valida (RN-1)
- [x] 2.3 Validar el mínimo de 8 caracteres al fijar contraseña; verificar con pruebas de 7 y de 8 caracteres
- [x] 2.4 Crear `SesionToken` (`jti`, `usuario`, `creado_en`, `ultimo_uso`, `revocado_en`, `user_agent`) con índice en `jti`; verificar que la migración inicial incluye usuario y sesión y que `makemigrations --check` no reporta pendientes
- [x] 2.5 Crear `IntentoIngreso` (`correo_normalizado`, `exito`, `creado_en`, `ip`) con índice por correo y fecha; verificar con una prueba que se registra un intento por cada llamada a login, exitosa o fallida

## 3. Servicios de autenticación

- [x] 3.1 Implementar `services.emitir_token(usuario)`: JWT HS256 con `sub`, `jti`, `iat`, `exp` de 8 horas y su fila en `SesionToken`; verificar con una prueba que el token decodifica con los cuatro *claims* y que queda una sesión activa
- [x] 3.2 Implementar `services.validar_token(token)`: firma, `exp`, sesión no revocada, usuario `Activo` e inactividad menor a 8 horas, actualizando `ultimo_uso` con amortiguación de 60 segundos; verificar con pruebas de token válido, firma alterada, sesión revocada, usuario desactivado y `ultimo_uso` de hace 9 horas (RN-3, RN-4)
- [x] 3.3 Implementar `services.contar_intentos_fallidos(correo)` y el bloqueo de 15 minutos tras 5 fallos posteriores al último éxito; verificar con pruebas de 4 fallos (pasa), 5 fallos (`429`), 5 fallos con la contraseña correcta (`429`), bloqueo vencido a los 16 minutos y reinicio tras un ingreso exitoso (RN-2)
- [x] 3.4 Implementar `services.autenticar(correo, password, ip)` con el orden bloqueo → credenciales → estado de la cuenta, verificando el hash contra un valor ficticio cuando el correo no existe; verificar con pruebas que el mensaje de correo inexistente y el de contraseña incorrecta son idénticos y que la cuenta inactiva responde `403`
- [x] 3.5 Implementar `services.cerrar_sesion(jti)` marcando `revocado_en`; verificar con una prueba que el mismo token deja de validar y que otra sesión del mismo usuario sigue válida

## 4. Endpoints del API

- [x] 4.1 Crear `apps/usuarios/schemas.py` con `LoginIn`, `UsuarioOut` (`nombre`, `correo`, `rol`, `sede`, `estado`) y `ErrorOut` (`codigo`, `mensaje`, `campo`); verificar con una prueba que `UsuarioOut` no expone la contraseña ni su hash
- [x] 4.2 Implementar `POST /api/auth/login` (sin `auth`) devolviendo `{token, usuario}` y fijando la cookie `sesion` (`HttpOnly`, `SameSite=Lax`, `Secure` fuera de desarrollo); verificar con pruebas de `200`, `401`, `403` y `429` y de la presencia de los atributos de la cookie
- [x] 4.3 Implementar el autenticador de Ninja que lee la cookie `sesion` y, como alternativa, `Authorization: Bearer`; verificar con pruebas que ambos caminos autentican y que sin ninguno responde `401`
- [x] 4.4 Implementar `GET /api/auth/me` y `POST /api/auth/logout`; verificar con pruebas que `me` devuelve el usuario del token, que `logout` responde `200` y borra la cookie, y que el token usado responde `401` después
- [x] 4.5 Reemitir la cookie cuando al JWT le quede menos de 1 hora y la sesión siga activa; verificar con una prueba que la respuesta trae `Set-Cookie` en ese caso y no lo trae en una petición recién autenticada
- [x] 4.6 Enviar `Cache-Control: no-store` en las respuestas autenticadas; verificar con una prueba de la cabecera en `GET /api/auth/me`
- [x] 4.7 Crear `manage.py seed` con las cuatro cuentas de D8 (incluida la inactiva) y documentarlas en `docs/DATOS.md`; verificar que ejecutarlo dos veces no duplica usuarios y que se niega a correr en producción
- [x] 4.8 Crear `manage.py purgar_sesiones` que borra sesiones revocadas o caducadas hace más de 30 días; verificar con una prueba que conserva las recientes y borra las antiguas

## 5. Sesión en el frontend

- [x] 5.1 Añadir el proxy de `/api` en `app/vite.config.ts` y dejarlo documentado en `app/README.md`; verificar que desde la SPA una llamada a `/api/docs` responde por el mismo origen
- [x] 5.2 Crear `app/src/api/client.ts` con `fetch` centralizado, `credentials: 'include'` y manejo global del `401` (limpia la sesión y lleva a `/login`); verificar con pruebas unitarias del cliente sobre `fetch` simulado
- [x] 5.3 Crear `app/src/context/SesionContext.tsx` con `{usuario, cargando, ingresar, cerrarSesion}` que consulta `GET /api/auth/me` al montar; verificar con pruebas que el estado `cargando` precede a la decisión y que un `401` deja `usuario` en nulo
- [x] 5.4 Crear `app/src/components/auth/RutaProtegida.tsx` que no pinta nada mientras `cargando` y redirige a `/login` con `state.desde`; verificar con una prueba que no hay parpadeo hacia `/login` durante la carga
- [x] 5.5 Reescribir `app/src/App.tsx` con `/login` pública y todo el `AppShell` detrás de `RutaProtegida`; verificar que abrir `/polizas` sin sesión lleva a `/login` y que `/login` con sesión lleva a `/dashboard`

## 6. Pantalla de ingreso

- [x] 6.1 Añadir a `app/src/styles/global.css` las clases `.login-wrap`, `.login-hero`, `.login-box` y `.login-err` usando sólo `var(--token)`, y extraer el degradado de `.side` para que ambas lo compartan; verificar que `.side` se sigue viendo igual en el navegador
- [x] 6.2 Crear `app/src/pages/auth/LoginPage.tsx` con el panel del logo y el formulario armado con `.card`, `.fgrid`, `.field.full`, `.lbl`, `.req`, `.inp`, `.hint` y `.btn.btn-pri`, con `data-testid` en `login-correo`, `login-password`, `login-enviar` y `login-error`; verificar que no hay ningún color literal ni ninguna clase inventada fuera de las de 6.1
- [x] 6.3 Implementar el envío: deshabilitar el botón mientras se envía, mostrar el mensaje del backend en `.login-err`, conservar el correo y vaciar la contraseña, y redirigir a `state.desde` o a `/dashboard`; verificar con pruebas unitarias del componente para los tres mensajes de error y para el retorno a la ruta pedida
- [x] 6.4 Actualizar `app/src/components/layout/Sidebar.tsx` para tomar nombre, iniciales y rol del contexto y añadir el botón de cerrar sesión con `data-testid` `side-usuario` y `btn-cerrar-sesion`; verificar que ya no queda ningún dato de usuario escrito en el código
- [x] 6.5 Comparar la pantalla contra una existente en el navegador (radios, alturas y espaciado) según el paso 4 de `docs/DESIGN-SYSTEM.md`; verificar con una captura lado a lado

## 7. Pruebas y cierre

- [x] 7.1 Instalar y configurar Vitest en `app/` con el script `test:unit`; verificar que `npm run test:unit` corre en verde las pruebas de los puntos 5 y 6
- [x] 7.2 Configurar Playwright (`playwright.config.ts`, servidores de `api/` y `app/`, video y captura, `storageState` para las sesiones); verificar que `npx playwright test --list` enumera la suite
- [x] 7.3 Escribir `e2e/specs/hu-001-autenticacion.spec.ts` con un `test()` por cada `#### Scenario` de `specs/autenticacion/spec.md`; verificar recorriendo la spec que no queda ningún escenario sin prueba
- [x] 7.4 Comprobación explícita de la HU: recorrer todas las rutas de `App.tsx` sin sesión y confirmar que ninguna es alcanzable; verificar con un `test()` parametrizado sobre la lista de rutas
- [x] 7.5 Ejecutar la puerta de entrega de nivel 2 (`ruff check .`, `pytest -q`, `npm run lint`, `npm run test:unit`, `npx playwright test e2e/specs/hu-001-*`) y dejar la evidencia en `e2e/evidencia/`; verificar que la tabla del reporte no tiene fallos
- [x] 7.6 Ejecutar `openspec validate hu-001-autenticacion --strict`; verificar que no hay errores. Con `--strict` quedan seis avisos porque el validador busca SHALL/MUST en inglés y las specs del proyecto están en español ("DEBE"): son avisos de idioma, no fallos de estructura, y hay que decidir de una vez para todo el proyecto si se asumen o si se ajusta el gate
