# HU-002 — Estructura de navegación de la aplicación

|  |  |
|---|---|
| **Épica** | E0 — Fundación técnica y acceso |
| **Prioridad** | Must |
| **Depende de** | HU-001 |

## Historia

**Como** usuario autenticado
**quiero** una barra lateral y superior constantes con las secciones del sistema
**para** moverme entre Inicio, Clientes, Pólizas y Configuración sin perder el contexto.

## Contexto en el prototipo

`AppShell.tsx` compone `Sidebar` + `Topbar` + `<Outlet/>`. El menú agrupa: **Principal**
(Inicio, Clientes), **Operación** (Pólizas) y **Sistema** (Configuración). `App.tsx` define
las rutas y redirige `/` y cualquier ruta desconocida a `/dashboard`.

## Criterios de aceptación

### CA-1 — Sección activa
**CUANDO** el usuario está en `/polizas` o en cualquier ruta hija (`/polizas/PZ001`)
**ENTONCES** el ítem "Pólizas" del menú aparece resaltado como activo.

### CA-2 — Redirección por defecto
**CUANDO** el usuario abre `/`
**ENTONCES** el sistema lo lleva a `/dashboard`.

### CA-3 — Ruta inexistente
**CUANDO** el usuario abre una ruta que no existe
**ENTONCES** el sistema lo lleva a `/dashboard` sin mostrar una pantalla en blanco.

### CA-4 — Identidad del usuario y de la agencia
**CUANDO** hay sesión activa
**ENTONCES** el pie de la barra lateral muestra nombre y rol del usuario, y la barra superior
muestra el nombre de la agencia.

### CA-5 — Menú según permisos
**CUANDO** el usuario tiene un rol sin acceso a Configuración
**ENTONCES** ese ítem no se muestra y la ruta directa responde "No tienes permiso".

## Reglas de negocio

- RN-1 — La navegación es del lado del cliente: cambiar de sección no recarga la página completa.
- RN-2 — El menú se arma a partir de los permisos del rol (ver HU-020).

## Datos y API

Ninguna nueva. Consume `GET /api/auth/me` para nombre, rol y permisos.

## Hecho cuando

- [ ] Unitarias del cálculo de ítems visibles por rol.
- [ ] E2E `e2e/hu-002-navegacion.spec.ts`: recorrido por las cuatro secciones y verificación del ítem activo.
