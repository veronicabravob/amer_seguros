# HU-019 — Gestionar usuarios de la agencia

|  |  |
|---|---|
| **Épica** | E5 — Usuarios y permisos |
| **Prioridad** | Must |
| **Depende de** | HU-001, HU-007 |

## Historia

**Como** administrador
**quiero** crear cuentas de acceso para el equipo con su rol y sede
**para** que cada persona entre con sus credenciales y vea lo que le corresponde.

## Contexto en el prototipo

`config/UsuariosListPage.tsx` (buscador y filtro por perfil: Administrador, Asesor comercial, Cobros,
Recepción) y `config/UsuarioFormPage.tsx` (datos principales, contacto, credenciales: nombre de
usuario, contraseña y confirmación, perfil, sede, "cuenta activa", autorización de datos).

## Criterios de aceptación

### CA-1 — Crear usuario
**CUANDO** el administrador guarda nombre, correo, usuario, contraseña, perfil y sede válidos
**ENTONCES** la cuenta queda creada como activa y aparece en el listado.

### CA-2 — Contraseña confirmada
**CUANDO** la contraseña y su confirmación no coinciden
**ENTONCES** el sistema no crea la cuenta y señala el campo de confirmación.

### CA-3 — Correo y usuario únicos
**CUANDO** el correo o el nombre de usuario ya existen
**ENTONCES** el sistema rechaza la creación indicando cuál está repetido.

### CA-4 — Filtrar por perfil
**CUANDO** filtra por "Asesor comercial"
**ENTONCES** el listado muestra sólo usuarios con ese perfil.

### CA-5 — Desactivar cuenta
**CUANDO** desactiva una cuenta
**ENTONCES** ese usuario no puede iniciar sesión (ver HU-001 CA-3) y su historial se conserva.

### CA-6 — No quedarse sin administradores
**CUANDO** intenta desactivar al último administrador activo
**ENTONCES** el sistema lo impide.

## Reglas de negocio

- RN-1 — Perfiles: Administrador, Asesor comercial, Cobros, Recepción.
- RN-2 — Contraseña mínima de 8 caracteres con letras y números; nunca se muestra ni se envía en respuestas.
- RN-3 — Todo usuario pertenece a una sede.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET/POST | `/api/usuarios` | Listado y creación |
| PUT | `/api/usuarios/{id}` | Editar |
| PATCH | `/api/usuarios/{id}/estado` | Activar / desactivar |

## Hecho cuando

- [ ] Unitarias: unicidad, política de contraseña, regla del último administrador.
- [ ] E2E `e2e/hu-019-usuarios.spec.ts`: crear usuario, filtrar por perfil, error de confirmación.
