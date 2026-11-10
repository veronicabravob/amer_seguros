# Brief — HU-002 · Estructura de navegación

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-002-navegacion` |
| **HU fuente** | `docs/hu/HU-002-navegacion.md` |
| **Épica** | E0 — Fundación y acceso |
| **Prioridad** | Must |
| **Depende de** | HU-001 |
| **Capacidad** | `navegacion` (ADDED) |

## Intención

El prototipo ya tiene `AppShell` con barra lateral y superior, pero la identidad y el menú están
escritos en el código. Este cambio convierte la navegación en comportamiento especificado: la
sección activa, las redirecciones por defecto, la identidad real del usuario autenticado y el
menú armado a partir de sus permisos.

## Alcance

- Marcado de la sección activa, incluidas rutas hijas (`/polizas/PZ001` resalta "Pólizas").
- Redirección de `/` y de cualquier ruta desconocida a `/dashboard`.
- Nombre y rol del usuario en el pie de la barra lateral y nombre de la agencia en la barra
  superior, tomados de `GET /api/auth/me`.
- Menú calculado según los permisos del rol, y ruta directa denegada cuando no hay permiso.

## Fuera de alcance

- La definición de la matriz de permisos: aquí sólo se **consume** (HU-020 la define).
- Rediseño del menú, iconografía nueva o reordenamiento de secciones.
- Navegación móvil o menú colapsable: el prototipo no los tiene.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Marcado de la sección activa | Ruta hija de `/polizas` resalta el ítem del menú |
| CA-2 | Redirección por defecto | Apertura de `/` |
| CA-3 | Ruta inexistente | Ruta desconocida sin pantalla en blanco |
| CA-4 | Identidad del usuario y de la agencia | Sesión activa muestra nombre, rol y agencia |
| CA-5 | Menú según permisos | Rol sin acceso a Configuración |

## Reglas para el `design.md`

- RN-1 — La navegación es del lado del cliente: cambiar de sección no recarga la página.
- RN-2 — El menú se arma con los permisos del rol; ocultar el ítem **no** es control de acceso:
  la ruta directa también responde "No tienes permiso" y el backend valida (HU-020).
- Los grupos del menú se conservan tal cual: Principal (Inicio, Clientes), Operación (Pólizas),
  Sistema (Configuración).

## Superficie de API (Django Ninja)

Ninguna ruta nueva. Consume `GET /api/auth/me` para nombre, rol, agencia y permisos.

## Reutilización visual

- `app/src/components/layout/AppShell.tsx`, `Sidebar.tsx` y `Topbar.tsx` ya existen: se ajustan,
  no se rehacen.
- Sin clases nuevas: el estado activo del menú ya está resuelto en `global.css`.
- `data-testid` en cada ítem del menú, en el pie de la barra lateral y en el nombre de la agencia.

## Verificación

- Unitarias del cálculo de ítems visibles por rol (función pura, sin renderizar).
- E2E `e2e/specs/hu-002-navegacion.spec.ts`: recorrido por las cuatro secciones, ítem activo,
  redirecciones y menú recortado para un rol sin Configuración.

## Decisiones abiertas

1. **Dependencia adelantada**: CA-5 necesita permisos, que llegan en HU-020 (épica E2 del backlog).
   Propuesta: especificar CA-5 aquí y, en E0, servirlo con la matriz mínima de rol devuelta por
   `/api/auth/me`; la prueba E2E de CA-5 queda pendiente hasta E2. Confirmar antes de la spec.
2. **Origen del nombre de la agencia**: ¿campo del usuario o entidad `Agencia` propia? Define si
   E0 ya necesita el modelo de agencia o basta con un valor de configuración.
