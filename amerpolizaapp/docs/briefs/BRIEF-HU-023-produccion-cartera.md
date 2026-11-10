# Brief — HU-023 · Producción mensual y cartera por ramo

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-023-produccion-cartera` |
| **HU fuente** | `docs/hu/HU-023-produccion-cartera.md` |
| **Épica** | E7 — Tablero y alertas |
| **Prioridad** | Could |
| **Depende de** | HU-021 |
| **Capacidad** | `tablero-indicadores` (MODIFIED: series y agregados) |

## Intención

Los cuatro indicadores dicen cómo va hoy la cartera; la producción mensual y la composición por
ramo dicen hacia dónde va. Hoy ambos bloques del tablero se dibujan con `ramosCartera` de
`helpers.ts`. Este cambio los calcula en el backend y fija las reglas de agregación para que los
números sean comparables mes a mes.

## Alcance

- Serie de producción de los últimos seis meses, con el mes en curso resaltado.
- Agregado de cartera por ramo, ordenado de mayor a menor prima, con número de pólizas y valor.
- Barra proporcional al ramo de mayor prima.
- Meses sin producción representados en cero, sin romper la escala.
- Texto accesible del valor de cada barra.

## Fuera de alcance

- Comparativos por asesor, aseguradora o sede.
- Rango de fechas configurable: la serie es fija de seis meses.
- Exportación de los gráficos y descarga de la serie.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Serie de producción de seis meses | Apertura del tablero |
| CA-2 | Cartera por ramo ordenada | Ramos con prima acumulada |
| CA-3 | Proporción de las barras | Ramo con la mayor prima |
| CA-4 | Mes sin producción | Mes con cero pólizas nuevas |
| CA-5 | Accesibilidad del gráfico | Lectura del valor de cada barra |

## Reglas para el `design.md`

- RN-1 — Una póliza cuenta como producción del mes de su fecha de expedición (misma convención que
  HU-018 RN-2).
- RN-2 — La cartera por ramo suma sólo pólizas vigentes.
- Los seis meses incluyen el actual; los meses sin datos aparecen igualmente en la serie.

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/dashboard/produccion?meses=6` | Serie mensual |
| GET | `/api/dashboard/cartera-ramo` | Agregado por ramo |

## Reutilización visual

- Bloques existentes en `pages/DashboardPage.tsx`: gráfico de barras y lista de cartera por ramo.
- Clases: `.dash-grid`, `.card`, `.pad`, la barra proporcional ya existente y `.money`.
- Sin librerías de gráficos nuevas: el gráfico actual se construye con CSS.
- Cada barra expone su valor con `aria-label` o texto visualmente oculto, y `data-testid` por mes.

## Verificación

- Unitarias de la agregación mensual y por ramo, incluyendo meses vacíos y empates de prima.
- E2E `e2e/specs/hu-023-produccion-cartera.spec.ts`: CA-1, CA-2 y CA-4.

## Decisiones abiertas

1. **Qué cuenta como "producción"**: ¿sólo pólizas nuevas o también renovaciones? El gráfico se
   titula "pólizas nuevas" pero la renovación también es ingreso. Es la decisión que más cambia el
   número.
2. **Alcance por rol**: la HU no lo menciona, pero HU-021 CA-4 sí. Confirmar si estos dos bloques
   también se recortan a la cartera del asesor.
3. **Unidad de la serie**: ¿número de pólizas o prima emitida? El prototipo dibuja barras sin unidad
   explícita.
