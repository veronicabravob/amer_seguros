# Brief — HU-020 · Control de acceso por rol

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-020-roles-permisos` |
| **HU fuente** | `docs/hu/HU-020-roles-permisos.md` |
| **Épica** | E2 — Usuarios y permisos |
| **Prioridad** | Must |
| **Depende de** | HU-019 |
| **Capacidad** | `control-acceso` (ADDED) · `navegacion` (MODIFIED: menú por permisos) |

## Intención

Con cuentas creadas hace falta definir qué puede ver y hacer cada perfil antes de exponer datos
sensibles: comisiones, configuración y cartera de otros asesores. Esta HU define la matriz de
permisos, y sobre todo establece que se valida en el backend: ocultar un ítem del menú no protege
nada.

## Alcance

- Matriz de permisos por perfil (Administrador, Asesor comercial, Cobros, Recepción) sobre módulos
  y acciones.
- Entrega de rol y permisos en `GET /api/auth/me` para que el frontend arme el menú (HU-002).
- Denegación coherente: la interfaz muestra el mensaje y la API responde 403.
- Ocultamiento de valores de comisión para los perfiles que no pueden verlos.
- Registro en auditoría de los intentos denegados.

## Fuera de alcance

- Roles configurables por el usuario: los cuatro perfiles son fijos en esta versión.
- Permisos por registro individual más allá de "el asesor edita sus pólizas".
- Auditoría completa de todas las acciones: aquí sólo los intentos denegados.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Alcance del perfil Administrador | Ingreso de un administrador |
| CA-2 | Alcance del perfil Asesor comercial | Asesor sin Configuración y con edición limitada a sus pólizas |
| CA-3 | Alcance del perfil Cobros | Lectura de pólizas y registro de gestiones de cobro |
| CA-4 | Alcance del perfil Recepción | Clientes y consulta de pólizas sin ver comisiones |
| CA-5 | Denegación de acceso directo | Ruta o endpoint sin permiso responde 403 |

## Reglas para el `design.md`

- RN-1 — Los permisos se validan en el backend; ocultar el menú no es control de acceso.
- RN-2 — Los valores de comisión sólo son visibles para Administrador (aplica también a las
  exportaciones, HU-025).
- RN-3 — Todo intento denegado queda registrado en auditoría.
- La matriz se declara en un único lugar del backend y se reutiliza en cada router; no se repite
  la condición endpoint por endpoint.

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/auth/me` | Devuelve rol y matriz de permisos |

Resto del API: todos los routers aplican la comprobación de permiso.

## Reutilización visual

- Mensaje "No tienes permiso para esta sección" con la clase `.empty` del sistema de diseño.
- El menú se recorta en `Sidebar.tsx` con los permisos recibidos (ya previsto en HU-002).
- Las columnas y bloques de comisión se ocultan, no se muestran vacíos.

## Verificación

- Unitarias de la matriz: tabla parametrizada endpoint × rol → permitido o 403.
- E2E `e2e/specs/hu-020-roles-permisos.spec.ts`: un caso por rol verificando menú visible y
  respuesta 403 al entrar por ruta directa.
- Regresión: la suite de E0 debe seguir en verde con el administrador.

## Decisiones abiertas

1. **Granularidad**: ¿permisos por módulo ("polizas.ver", "polizas.editar") o por endpoint? Lo
   primero es más simple de entender y basta para los cinco escenarios.
2. **"Sus pólizas" (CA-2)**: ¿el vínculo es el asesor asignado a la póliza, el creador del registro,
   o ambos? Determina el filtro por defecto de listados y tablero (HU-021, HU-022).
3. **Alcance por sede**: ¿un administrador ve todas las sedes o sólo la suya? La HU no lo define y
   afecta a todos los listados.
4. **Dónde vive la auditoría**: modelo propio en `core` o registro por señal de Django. Conviene
   resolverlo aquí porque HU-011, HU-024 y HU-030 también auditan.
