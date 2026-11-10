# Brief — HU-012 · Listar pólizas con filtros y vistas

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-012-listar-polizas` |
| **HU fuente** | `docs/hu/HU-012-listar-polizas.md` |
| **Épica** | E4 — Pólizas, consulta |
| **Prioridad** | Must |
| **Depende de** | HU-002, HU-004, HU-005 |
| **Capacidad** | `polizas` (ADDED: consulta y vigencia) |

## Intención

Es la pantalla más usada del producto y la que entrega valor antes incluso de poder emitir desde
el sistema: saber qué vence, qué está vencido y qué hay que cobrar. `polizas/PolizasListPage.tsx`
ya tiene chips, filtros, dos vistas y la barra de vigencia; este cambio crea la entidad póliza y
define con precisión el cálculo de estado y de días, que hoy vive en `data/helpers.ts`.

## Alcance

- Modelo de póliza con cliente, aseguradora, ramo, riesgo, vigencia, prima y estado.
- Listado paginado con conteo "X de Y" y chips Todas, Vigentes, Por vencer, Vencidas, Nuevas.
- Filtros por aseguradora y ramo, combinables con el chip activo y con la búsqueda (HU-003).
- Barra de avance de la vigencia y texto de días restantes o vencidos.
- Etiquetas NUEVA y RENOV.
- Alternancia entre vista tabla y vista tarjetas sin perder filtros.
- Estado vacío con "Limpiar filtros" y apertura del detalle desde la fila.

## Fuera de alcance

- El detalle de la póliza: HU-013.
- Crear, editar o renovar: HU-014 y HU-016.
- Selección múltiple y acciones masivas: HU-024 (aunque la casilla ya exista en el prototipo).
- Pestañas "Anexos" y "Vinculados" del listado: sin criterios en la HU.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Listado con estado de vigencia | Apertura de `/polizas` con barra y días |
| CA-2 | Filtro por estado | Chip "Por vencer" (30 días) |
| CA-3 | Filtro por aseguradora y ramo | Ambos selectores con chip activo |
| CA-4 | Cambio de vista | Paso a tarjetas conservando filtros |
| CA-5 | Marcas de póliza nueva y renovada | Etiquetas NUEVA y RENOV |
| CA-6 | Apertura del detalle | Clic en la fila; la casilla no navega |
| CA-7 | Resultado vacío | Combinación de filtros sin resultados |

## Reglas para el `design.md`

- RN-1 — "Por vencer" = fecha fin dentro de los próximos 30 días; "Vencida" = fecha fin anterior a hoy.
- RN-2 — El avance de vigencia es el porcentaje de días transcurridos entre inicio y fin, acotado a 0–100.
- RN-3 — Los días restantes se calculan contra la fecha del sistema; no se almacenan.
- RN-4 — Paginación de 25 registros; el conteo del encabezado corresponde al total filtrado.
- El cálculo de estado y días vive en el backend (`services.py`), no en los componentes de React.

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/polizas?q=&estado=&aseguradora=&ramo=&page=` | Listado paginado |
| GET | `/api/polizas/resumen` | Conteos por estado para los chips |

## Reutilización visual

- Pantalla existente `polizas/PolizasListPage.tsx`.
- Clases: `.toolbar`, `.chips`, `.chip.on`, `.chip-ct`, `.sel`, `.seg` (tabla/tarjetas), `.tblwrap`,
  `.tbl`, `.prow`, `.badge` + `.st-vigente`/`.st-vencer`/`.st-vencida`, `.tag-new`, `.tag-ren`,
  `.money`, `.pager`, `.empty`.
- `data-testid` en cada chip, en los selectores, en el alternador de vista y en las filas.

## Verificación

- Unitarias del cálculo de estado, porcentaje de avance y etiqueta de días, con casos de borde:
  vence hoy, vencida hace un día, año bisiesto, vigencia de un solo día.
- E2E `e2e/specs/hu-012-listar-polizas.spec.ts`: CA-1 a CA-7.
- Esta suite entra en regresión (`@regresion`): es la que detecta roturas de épicas posteriores.

## Decisiones abiertas

1. **Estado almacenado o calculado**: la póliza tiene un estado propio (Vigente, Cancelada,
   Renovada) además del estado de vigencia calculado por fechas. Definir los dos conceptos y cómo
   se combinan en los chips, o la spec quedará ambigua.
2. **Chip "Nuevas"**: ¿son pólizas sin renovación previa, o emitidas dentro de un periodo reciente?
   El prototipo usa la etiqueta NUEVA; la HU no lo define.
3. **Zona horaria**: contra qué reloj se calcula "hoy" (servidor en UTC frente a hora de Colombia).
   Afecta directamente a las pruebas de borde y a CI.
4. **Alcance por rol**: el asesor ve sólo sus pólizas (HU-020 CA-2); confirmar si el filtro es por
   defecto o si existe un conmutador "ver todas".
