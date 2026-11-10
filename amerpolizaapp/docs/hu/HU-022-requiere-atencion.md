# HU-022 — Bandeja "Requiere tu atención"

|  |  |
|---|---|
| **Épica** | E6 — Tablero y alertas |
| **Prioridad** | Must |
| **Depende de** | HU-012, HU-016 |

## Historia

**Como** asesor comercial
**quiero** una bandeja con lo que está por vencer, vencido o pendiente de cobro
**para** trabajar por prioridad en lugar de revisar toda la cartera.

## Contexto en el prototipo

`DashboardPage.tsx`, bloque "Requiere tu atención": cada fila muestra cliente, detalle
(número, ramo y días), tipo (Cobro, Por vencer, Renovación) con color y un botón de acción
(Gestionar, Renovar, Recordar, Contactar).

## Criterios de aceptación

### CA-1 — Composición de la bandeja
**CUANDO** el asesor abre el tablero
**ENTONCES** la bandeja lista pólizas vencidas, por vencer en 30 días y cobros pendientes, ordenadas por urgencia.

### CA-2 — Semáforo
**CUANDO** un elemento está vencido
**ENTONCES** se muestra en rojo; por vencer en ámbar; renovación en verde azulado.

### CA-3 — Acción directa
**CUANDO** presiona "Renovar" en un elemento
**ENTONCES** el sistema abre la renovación de esa póliza (HU-016) con los datos precargados.

### CA-4 — Bandeja vacía
**CUANDO** no hay nada pendiente
**ENTONCES** se muestra "No tienes pendientes por ahora" en lugar de una lista vacía.

### CA-5 — Alcance por rol
**CUANDO** el usuario es asesor
**ENTONCES** la bandeja muestra sólo sus clientes; el administrador ve toda la agencia.

### CA-6 — Ver todo
**CUANDO** presiona "Ver todo"
**ENTONCES** navega al listado de pólizas con el filtro correspondiente ya aplicado.

## Reglas de negocio

- RN-1 — Orden: vencidas primero (más antiguas arriba), luego por vencer (menos días arriba), luego renovaciones.
- RN-2 — La bandeja muestra máximo 10 elementos; el resto se consulta con "Ver todo".
- RN-3 — Una póliza renovada sale de la bandeja inmediatamente.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/dashboard/atencion` | Elementos priorizados |

## Hecho cuando

- [ ] Unitarias del ordenamiento y de la clasificación por tipo.
- [ ] E2E `e2e/hu-022-requiere-atencion.spec.ts`: CA-1, CA-3, CA-4, CA-6.
