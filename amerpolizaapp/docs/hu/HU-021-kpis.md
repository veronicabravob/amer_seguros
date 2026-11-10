# HU-021 — Indicadores del tablero

|  |  |
|---|---|
| **Épica** | E6 — Tablero y alertas |
| **Prioridad** | Should |
| **Depende de** | HU-012 |

## Historia

**Como** gerente de la agencia
**quiero** ver los indicadores clave al entrar
**para** saber en diez segundos cómo va la cartera.

## Contexto en el prototipo

`DashboardPage.tsx`: cuatro tarjetas — Pólizas activas, Prima anual en cartera, Por vencer (30 días)
y Renovaciones abiertas — cada una con su variación frente al mes anterior. Hoy los valores están fijos.

## Criterios de aceptación

### CA-1 — Valores reales
**CUANDO** el usuario abre `/dashboard`
**ENTONCES** cada indicador muestra el valor calculado sobre las pólizas de la agencia, no un valor fijo.

### CA-2 — Comparación mensual
**CUANDO** existe información del mes anterior
**ENTONCES** cada tarjeta muestra la variación porcentual con su signo y color (verde al alza, rojo a la baja).

### CA-3 — Sin datos del mes anterior
**CUANDO** no hay historia suficiente
**ENTONCES** la tarjeta omite la variación en lugar de mostrar 0 %.

### CA-4 — Alcance por rol
**CUANDO** el usuario es asesor comercial
**ENTONCES** los indicadores consideran sólo su cartera; el administrador ve la agencia completa.

### CA-5 — Formato de valores
**CUANDO** un indicador es monetario
**ENTONCES** se abrevia en millones con un decimal (por ejemplo `$4.812M`) y su valor exacto aparece al pasar el cursor.

## Reglas de negocio

- RN-1 — "Por vencer (30 días)" cuenta pólizas cuyo fin cae en los próximos 30 días.
- RN-2 — "Prima anual en cartera" suma la prima de las pólizas vigentes.
- RN-3 — Los indicadores se calculan en el backend en una sola consulta.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/dashboard/kpis` | Indicadores con comparativo mensual |

## Hecho cuando

- [ ] Unitarias de cada indicador y del comparativo, con datos de prueba controlados.
- [ ] E2E `e2e/hu-021-kpis.spec.ts`: verificar los cuatro indicadores contra los datos sembrados.
