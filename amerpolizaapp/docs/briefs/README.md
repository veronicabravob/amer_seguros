# Briefs para los cambios de OpenSpec — AMER Pólizas

Un brief por historia de usuario. Es el texto que se le entrega al agente **después de abrir el
cambio** (`/opsx:new hu-XXX-<slug>`) y **antes de pedir la propuesta** (`/opsx:continue`).

La HU describe el comportamiento; el brief la traduce a **intención de cambio**: qué capacidad se
crea o se modifica, qué entra y qué no, qué criterios se convierten en escenarios, qué reglas van
al `design.md` y qué decisiones quedan abiertas para discutir antes de escribir la spec.

## Cómo se usa

```
/opsx:new hu-012-listar-polizas
```

```
El brief de este cambio es docs/briefs/BRIEF-HU-012-listar-polizas.md; la fuente completa es
docs/hu/HU-012-listar-polizas.md. Léelos junto con docs/DESIGN-SYSTEM.md y las skills
diseno-amer y backend-django-ninja. Antes de escribir la propuesta, dime en cinco líneas qué
entendiste y responde las decisiones abiertas del brief.
```

```
/opsx:continue      # proposal.md  — alcance exactamente el del brief
/opsx:continue      # specs/       — un #### Scenario por cada CA de la tabla del brief
/opsx:continue      # design.md    — las reglas de negocio del brief y la reutilización visual
/opsx:continue      # tasks.md
```

> **Si `/opsx:new` y `/opsx:continue` no aparecen** es que OpenSpec está con el perfil `core`.
> Actívalos con `openspec config profile` → flujos de cambio → `new`, `continue`, `ff`, `verify`,
> y después `openspec update` (paso 3.3 de la guía). Mientras tanto, el brief se usa igual con el
> perfil básico: `/opsx:propose` genera los cuatro artefactos de una vez a partir del mismo texto,
> y se revisan después con `/opsx:update <cambio>`. Se pierde la revisión artefacto por artefacto,
> que es justamente donde sale barato corregir el rumbo.

## Estructura de un brief

| Sección | Para qué sirve en OpenSpec |
|---|---|
| Ficha | Identificador del cambio, épica, prioridad, capacidad afectada |
| Intención | El **porqué** del `proposal.md` |
| Alcance / Fuera de alcance | El límite que evita que el agente agregue funcionalidad |
| Escenarios a especificar | Tabla CA → `### Requirement` + `#### Scenario` de la spec |
| Reglas para el `design.md` | Restricciones técnicas y de negocio |
| Superficie de API | Endpoints propuestos para Django Ninja |
| Reutilización visual | Pantallas y clases existentes que se reutilizan |
| Verificación | Lo que exige la skill `gate-de-entrega` |
| Decisiones abiertas | Lo que se resuelve **antes** de escribir la spec |

## Índice por épica (orden de ejecución del backlog)

| Épica | Cambios | Brief |
|---|---|---|
| **E0 — Fundación y acceso** | `hu-001-autenticacion` | [BRIEF-HU-001](BRIEF-HU-001-autenticacion.md) |
| | `hu-002-navegacion` | [BRIEF-HU-002](BRIEF-HU-002-navegacion.md) |
| | `hu-003-busqueda-global` | [BRIEF-HU-003](BRIEF-HU-003-busqueda-global.md) |
| **E1 — Catálogos maestros** | `hu-004-aseguradoras` | [BRIEF-HU-004](BRIEF-HU-004-aseguradoras.md) |
| | `hu-005-ramos` | [BRIEF-HU-005](BRIEF-HU-005-ramos.md) |
| | `hu-006-catalogos-simples` | [BRIEF-HU-006](BRIEF-HU-006-catalogos-simples.md) |
| | `hu-007-sedes` | [BRIEF-HU-007](BRIEF-HU-007-sedes.md) |
| **E2 — Usuarios y permisos** | `hu-019-usuarios` | [BRIEF-HU-019](BRIEF-HU-019-usuarios.md) |
| | `hu-020-roles-permisos` | [BRIEF-HU-020](BRIEF-HU-020-roles-permisos.md) |
| **E3 — Clientes** | `hu-008-listar-clientes` | [BRIEF-HU-008](BRIEF-HU-008-listar-clientes.md) |
| | `hu-009-crear-cliente` | [BRIEF-HU-009](BRIEF-HU-009-crear-cliente.md) |
| | `hu-010-detalle-cliente` | [BRIEF-HU-010](BRIEF-HU-010-detalle-cliente.md) |
| | `hu-011-editar-cliente` | [BRIEF-HU-011](BRIEF-HU-011-editar-cliente.md) |
| **E4 — Pólizas, consulta** | `hu-012-listar-polizas` | [BRIEF-HU-012](BRIEF-HU-012-listar-polizas.md) |
| | `hu-013-detalle-poliza` | [BRIEF-HU-013](BRIEF-HU-013-detalle-poliza.md) |
| **E5 — Pólizas, emisión** | `hu-014-crear-poliza` | [BRIEF-HU-014](BRIEF-HU-014-crear-poliza.md) |
| | `hu-015-calculo-prima` | [BRIEF-HU-015](BRIEF-HU-015-calculo-prima.md) |
| **E6 — Vendedores y comisiones** | `hu-017-vendedores` | [BRIEF-HU-017](BRIEF-HU-017-vendedores.md) |
| | `hu-018-comision-poliza` | [BRIEF-HU-018](BRIEF-HU-018-comision-poliza.md) |
| | `hu-016-renovar-poliza` | [BRIEF-HU-016](BRIEF-HU-016-renovar-poliza.md) |
| **E7 — Tablero y alertas** | `hu-021-kpis` | [BRIEF-HU-021](BRIEF-HU-021-kpis.md) |
| | `hu-022-requiere-atencion` | [BRIEF-HU-022](BRIEF-HU-022-requiere-atencion.md) |
| | `hu-023-produccion-cartera` | [BRIEF-HU-023](BRIEF-HU-023-produccion-cartera.md) |
| **E8 — Operación masiva** | `hu-024-acciones-masivas` | [BRIEF-HU-024](BRIEF-HU-024-acciones-masivas.md) |
| | `hu-025-exportar` | [BRIEF-HU-025](BRIEF-HU-025-exportar.md) |
| | `hu-026-notificaciones` | [BRIEF-HU-026](BRIEF-HU-026-notificaciones.md) |
| **E9 — Expediente de la póliza** | `hu-027-anexos` | [BRIEF-HU-027](BRIEF-HU-027-anexos.md) |
| | `hu-028-archivos` | [BRIEF-HU-028](BRIEF-HU-028-archivos.md) |
| | `hu-029-bitacora-cobro` | [BRIEF-HU-029](BRIEF-HU-029-bitacora-cobro.md) |
| | `hu-030-siniestros-historial` | [BRIEF-HU-030](BRIEF-HU-030-siniestros-historial.md) |

## Mapa de capacidades de OpenSpec

Cada brief declara qué capacidad de `openspec/specs/` crea (`ADDED`) o amplía (`MODIFIED`).
Así las specs archivadas se acumulan de forma coherente en lugar de fragmentarse por HU.

| Capacidad | La crea | La amplían |
|---|---|---|
| `autenticacion` | HU-001 | HU-019 (cuenta inactiva) |
| `navegacion` | HU-002 | HU-020 (menú por permisos) |
| `busqueda-global` | HU-003 | — |
| `aseguradoras` | HU-004 | HU-015 (retenciones) |
| `ramos` | HU-005 | HU-015 (comisión e IVA de gastos) |
| `catalogos-simples` | HU-006 | HU-027, HU-030 (uso de motivos y estados) |
| `sedes` | HU-007 | HU-017, HU-019 (asignación) |
| `clientes` | HU-008 | HU-009, HU-010, HU-011, HU-026 |
| `polizas` | HU-012 | HU-013, HU-016, HU-024 |
| `emision-polizas` | HU-014 | HU-016 |
| `liquidacion-polizas` | HU-015 | HU-018, HU-027 |
| `renovacion-polizas` | HU-016 | HU-022 |
| `vendedores` | HU-017 | — |
| `comisiones` | HU-018 | — |
| `usuarios` | HU-019 | — |
| `control-acceso` | HU-020 | HU-025, HU-028, HU-029 |
| `tablero-indicadores` | HU-021 | HU-023 |
| `bandeja-atencion` | HU-022 | HU-029 |
| `acciones-masivas` | HU-024 | HU-025 |
| `exportaciones` | HU-025 | — |
| `notificaciones-cliente` | HU-026 | — |
| `anexos-poliza` | HU-027 | — |
| `archivos-poliza` | HU-028 | — |
| `bitacora-cobro` | HU-029 | — |
| `siniestros` · `historial-poliza` | HU-030 | — |

## Dos advertencias que salieron al convertir las HU

1. **La numeración de épicas no coincide** entre `docs/hu/README.md` (E2 = Clientes, E5 = Usuarios)
   y `docs/backlog/BACKLOG.md` (E2 = Usuarios, E3 = Clientes). Los briefs usan **la del backlog**,
   que es el plan de ejecución. Conviene alinear `docs/hu/README.md` antes de arrancar.
2. **Tres HU dependen de capacidades que llegan después** en el orden del backlog: HU-002 (CA-5)
   y HU-003 dependen de permisos y del listado de pólizas; HU-014 depende de vendedores (E6).
   Cada brief afectado lo declara en *Decisiones abiertas* con la salida propuesta.
