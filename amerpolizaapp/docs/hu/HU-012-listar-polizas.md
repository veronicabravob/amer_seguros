# HU-012 — Listar pólizas con filtros y vistas

|  |  |
|---|---|
| **Épica** | E3 — Pólizas |
| **Prioridad** | Must |
| **Depende de** | HU-002, HU-004, HU-005 |

## Historia

**Como** asesor comercial
**quiero** ver todas las pólizas con su estado de vigencia y filtrarlas
**para** priorizar renovaciones y cobros.

## Contexto en el prototipo

`polizas/PolizasListPage.tsx`: pestañas Pólizas/Anexos/Vinculados; chips Todas, Vigentes,
Por vencer, Vencidas, Nuevas con contador; selectores de aseguradora y ramo; alternador
Tabla/Tarjetas; tabla con número (+ etiquetas NUEVA / RENOV), riesgo, cliente y documento,
aseguradora, ramo, prima anual, vigencia con barra de avance y días restantes, estado y
acciones; barra de acciones masivas al seleccionar; paginación.

## Criterios de aceptación

### CA-1 — Listado con estado de vigencia
**CUANDO** el asesor abre `/polizas`
**ENTONCES** cada fila muestra el estado (Vigente, Por vencer, Vencida), la barra de avance de la vigencia y el texto de días ("Vence en 12 días", "Vencida hace 26 días", "245 días restantes").

### CA-2 — Filtro por estado
**CUANDO** selecciona el chip "Por vencer"
**ENTONCES** la tabla muestra sólo pólizas cuyo vencimiento ocurre dentro de los próximos 30 días y el encabezado indica cuántas de cuántas se muestran.

### CA-3 — Filtro por aseguradora y ramo
**CUANDO** elige una aseguradora y un ramo en los selectores
**ENTONCES** el listado aplica ambos filtros junto con el chip de estado activo.

### CA-4 — Cambio de vista
**CUANDO** presiona "Tarjetas"
**ENTONCES** los mismos resultados se presentan como tarjetas con número, cliente, aseguradora, ramo, prima y fecha de vencimiento, sin perder filtros ni búsqueda.

### CA-5 — Marcas de póliza nueva y renovada
**CUANDO** una póliza es nueva o proviene de una renovación
**ENTONCES** la fila muestra la etiqueta NUEVA o RENOV respectivamente.

### CA-6 — Abrir el detalle
**CUANDO** hace clic en una fila
**ENTONCES** navega a `/polizas/{id}`; hacer clic en la casilla de selección no navega.

### CA-7 — Estado vacío
**CUANDO** la combinación de filtros no arroja resultados
**ENTONCES** se muestra un estado vacío con la acción "Limpiar filtros".

## Reglas de negocio

- RN-1 — "Por vencer" = fecha fin dentro de los próximos 30 días; "Vencida" = fecha fin anterior a hoy.
- RN-2 — El avance de vigencia es el porcentaje de días transcurridos entre inicio y fin, acotado a 0–100.
- RN-3 — Los días restantes se calculan contra la fecha del sistema, no se almacenan.
- RN-4 — Paginación de 25 registros; el conteo del encabezado corresponde al total filtrado.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/polizas?q=&estado=&aseguradora=&ramo=&page=` | Listado paginado |
| GET | `/api/polizas/resumen` | Conteos por estado para los chips |

## Hecho cuando

- [ ] Unitarias: cálculo de estado, porcentaje de avance y etiqueta de días (incluye vencidas y bisiestos).
- [ ] E2E `e2e/hu-012-listar-polizas.spec.ts`: CA-1 a CA-7.
