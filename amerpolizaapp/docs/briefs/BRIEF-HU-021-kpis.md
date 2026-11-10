# Brief — HU-021 · Indicadores del tablero

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-021-kpis` |
| **HU fuente** | `docs/hu/HU-021-kpis.md` |
| **Épica** | E7 — Tablero y alertas |
| **Prioridad** | Should |
| **Depende de** | HU-012 |
| **Capacidad** | `tablero-indicadores` (ADDED) |

## Intención

El tablero es la primera pantalla que se ve al entrar y hoy muestra cuatro números fijos escritos
en el código de `DashboardPage.tsx`. Este cambio los calcula sobre las pólizas reales de la
agencia, con comparación mensual y alcance según el rol, para que el tablero deje de ser
decorativo y sirva para decidir.

## Alcance

- Cuatro indicadores calculados: pólizas activas, prima anual en cartera, por vencer (30 días) y
  renovaciones abiertas.
- Variación porcentual frente al mes anterior, con signo y color.
- Omisión de la variación cuando no hay historia suficiente.
- Alcance por rol: el asesor ve su cartera; el administrador, la agencia completa.
- Formato abreviado en millones con el valor exacto al pasar el cursor.

## Fuera de alcance

- Gráficos de producción y cartera por ramo: HU-023.
- La bandeja de pendientes: HU-022.
- Filtros de fecha o de sede sobre el tablero; exportación de indicadores.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Indicadores calculados | Apertura de `/dashboard` |
| CA-2 | Comparación mensual | Existe información del mes anterior |
| CA-3 | Sin historia suficiente | No hay datos del mes anterior |
| CA-4 | Alcance por rol | Asesor comercial frente a administrador |
| CA-5 | Formato de valores monetarios | Indicador en millones con valor exacto |

## Reglas para el `design.md`

- RN-1 — "Por vencer (30 días)" cuenta pólizas cuyo fin cae en los próximos 30 días (misma
  definición que HU-012 RN-1: una sola regla en el sistema).
- RN-2 — "Prima anual en cartera" suma la prima de las pólizas vigentes.
- RN-3 — Los indicadores se calculan en el backend en una sola consulta.
- La variación se omite, no se muestra como 0 %.

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/dashboard/kpis` | Indicadores con comparativo mensual |

## Reutilización visual

- Pantalla existente `pages/DashboardPage.tsx`.
- Clases: `.kpis`, `.kpi`, `.kpi-ic`, `.kpi-num`, `.kpi-lbl`, `.kpi-dl` con `.up` / `.dn` / `.wn`,
  `.money`.
- `data-testid` en cada tarjeta, en su valor y en su variación.

## Verificación

- Unitarias de cada indicador y del comparativo, con datos de prueba controlados (fechas fijas, sin
  depender del reloj de la máquina).
- E2E `e2e/specs/hu-021-kpis.spec.ts`: verificar los cuatro indicadores contra los datos sembrados
  por `manage.py seed`.

## Decisiones abiertas

1. **Definición de "renovaciones abiertas"**: ¿pólizas por vencer que aún no se renovaron, o
   renovaciones iniciadas como borrador? Sin acuerdo, el indicador no es verificable.
2. **Comparación mensual**: ¿se compara contra el cierre del mes anterior o contra el mismo día del
   mes anterior? Y para "pólizas activas", que es un saldo, ¿se guarda un corte mensual?
3. **Cartera del asesor (CA-4)**: reutilizar la definición de "sus pólizas" que se fije en HU-020.
4. **Rendimiento**: RN-3 pide una sola consulta; confirmar si se admite caché de unos minutos, y si
   eso rompería la prueba E2E.
