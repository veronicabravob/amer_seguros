# HU-020 — Control de acceso por rol

|  |  |
|---|---|
| **Épica** | E5 — Usuarios y permisos |
| **Prioridad** | Must |
| **Depende de** | HU-019 |

## Historia

**Como** administrador
**quiero** que cada perfil vea y haga sólo lo que le corresponde
**para** proteger la configuración y los datos sensibles de la agencia.

## Criterios de aceptación

### CA-1 — Administrador
**CUANDO** ingresa un usuario con perfil Administrador
**ENTONCES** ve y opera todos los módulos, incluida Configuración.

### CA-2 — Asesor comercial
**CUANDO** ingresa un asesor comercial
**ENTONCES** ve Inicio, Clientes y Pólizas, no ve Configuración, y sólo puede editar las pólizas donde figura como asesor.

### CA-3 — Cobros
**CUANDO** ingresa un usuario de Cobros
**ENTONCES** ve pólizas y bitácora de cobro en modo lectura y puede registrar gestiones de cobro, sin crear ni editar pólizas.

### CA-4 — Recepción
**CUANDO** ingresa un usuario de Recepción
**ENTONCES** puede crear y consultar clientes, y consultar pólizas, sin ver valores de comisión.

### CA-5 — Acceso directo denegado
**CUANDO** un usuario sin permiso abre una ruta protegida o llama a su endpoint
**ENTONCES** la interfaz muestra "No tienes permiso para esta sección" y la API responde 403.

## Reglas de negocio

- RN-1 — Los permisos se validan en el backend; ocultar el menú no es control de acceso.
- RN-2 — Los valores de comisión sólo son visibles para Administrador.
- RN-3 — Todo intento denegado queda registrado en auditoría.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/auth/me` | Devuelve rol y matriz de permisos |

## Hecho cuando

- [ ] Unitarias de la matriz de permisos por endpoint y rol.
- [ ] E2E `e2e/hu-020-roles-permisos.spec.ts`: un caso por rol, verificando menú y respuesta 403.
