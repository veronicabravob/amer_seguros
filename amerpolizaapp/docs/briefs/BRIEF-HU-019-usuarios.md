# Brief — HU-019 · Gestionar usuarios de la agencia

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-019-usuarios` |
| **HU fuente** | `docs/hu/HU-019-usuarios.md` |
| **Épica** | E2 — Usuarios y permisos |
| **Prioridad** | Must |
| **Depende de** | HU-001, HU-007 |
| **Capacidad** | `usuarios` (ADDED) · `autenticacion` (MODIFIED: cuenta inactiva) |

## Intención

HU-001 dio la sesión, pero las cuentas se crean a mano en la base de datos. Sin esta HU no hay
forma de sumar gente al sistema ni de retirarla, y HU-020 no tiene sobre qué operar.
`config/UsuariosListPage.tsx` y `config/UsuarioFormPage.tsx` ya tienen la pantalla; falta el
modelo, la política de contraseña y las reglas que protegen la administración.

## Alcance

- Alta, edición y listado de cuentas con nombre, contacto, nombre de usuario, perfil y sede.
- Filtro por perfil: Administrador, Asesor comercial, Cobros, Recepción.
- Política de contraseña y confirmación al crear.
- Unicidad de correo y de nombre de usuario.
- Activar y desactivar cuentas, con la regla del último administrador.

## Fuera de alcance

- Qué puede hacer cada perfil: eso es HU-020; aquí sólo se **asigna** el perfil.
- Cambio de contraseña por el propio usuario y recuperación por correo.
- Invitaciones por correo o autoregistro.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Creación de una cuenta | Alta con perfil y sede válidos |
| CA-2 | Confirmación de contraseña | Contraseña y confirmación distintas |
| CA-3 | Unicidad de correo y usuario | Correo o nombre de usuario repetido |
| CA-4 | Filtro por perfil | Selección de "Asesor comercial" |
| CA-5 | Desactivación de cuenta | Cuenta desactivada intenta ingresar (enlaza con HU-001 CA-3) |
| CA-6 | Protección del último administrador | Intento de desactivar al único administrador activo |

## Reglas para el `design.md`

- RN-1 — Perfiles: Administrador, Asesor comercial, Cobros, Recepción.
- RN-2 — Contraseña mínima de 8 caracteres con letras y números; nunca se muestra ni viaja en
  ninguna respuesta del API.
- RN-3 — Todo usuario pertenece a una sede (HU-007).
- La desactivación conserva el historial y la atribución de los registros creados por esa persona.

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET/POST | `/api/usuarios` | Listado y creación |
| PUT | `/api/usuarios/{id}` | Editar |
| PATCH | `/api/usuarios/{id}/estado` | Activar / desactivar |

## Reutilización visual

- Pantallas existentes `config/UsuariosListPage.tsx` y `config/UsuarioFormPage.tsx`.
- Clases: `.toolbar`, `.sel` para el filtro de perfil, `.tblwrap`, `.tbl`, `.badge` de estado,
  `.fgrid`, `.field`, `.inp`, `.switch` para "cuenta activa", `.form-foot`.
- `data-testid` en el filtro de perfil, en el mensaje de confirmación de contraseña y en la acción
  de desactivar.

## Verificación

- Unitarias: unicidad de correo y usuario, política de contraseña, regla del último administrador,
  hash reutilizado de HU-001.
- E2E `e2e/specs/hu-019-usuarios.spec.ts`: crear usuario, filtrar por perfil, error de confirmación.
- Demo de la épica: crear un asesor, entrar con él y comprobar que no ve Configuración (con HU-020).

## Decisiones abiertas

1. **Correo frente a nombre de usuario**: HU-001 autentica con correo y aquí se captura además un
   nombre de usuario. ¿Cuál es la credencial de ingreso? Recomendado: el correo, y el nombre de
   usuario queda como identificador visible.
2. **Contraseña inicial**: ¿la define el administrador (como en el prototipo) o se envía un enlace
   de activación? Si la define, decidir si se fuerza el cambio al primer ingreso.
3. **Usuario y vendedor**: ¿un asesor comercial es también un vendedor de HU-017, o son entidades
   independientes que se enlazan? Afecta a la asignación de asesor en la póliza (HU-014).
