# HU-023 — Producción mensual y cartera por ramo

|  |  |
|---|---|
| **Épica** | E6 — Tablero y alertas |
| **Prioridad** | Could |
| **Depende de** | HU-021 |

## Historia

**Como** gerente
**quiero** ver la producción de los últimos meses y la composición de la cartera por ramo
**para** decidir dónde enfocar el esfuerzo comercial.

## Contexto en el prototipo

`DashboardPage.tsx`: gráfico de barras "Producción mensual" (últimos 6 meses, con el mes actual
resaltado) y "Cartera por ramo" con barra proporcional, número de pólizas y prima acumulada
(`ramosCartera` en `helpers.ts`).

## Criterios de aceptación

### CA-1 — Producción de los últimos seis meses
**CUANDO** el usuario abre el tablero
**ENTONCES** el gráfico muestra las pólizas nuevas de cada uno de los últimos seis meses, con el mes en curso resaltado.

### CA-2 — Cartera por ramo ordenada
**CUANDO** se muestra la cartera por ramo
**ENTONCES** los ramos aparecen ordenados de mayor a menor prima acumulada, con su número de pólizas y el valor formateado.

### CA-3 — Proporción de la barra
**CUANDO** un ramo concentra la mayor prima
**ENTONCES** su barra ocupa el 100 % y las demás se dibujan en proporción a ella.

### CA-4 — Sin producción en un mes
**CUANDO** un mes no tuvo pólizas nuevas
**ENTONCES** la columna se muestra en cero, sin romper la escala del gráfico.

### CA-5 — Accesibilidad del gráfico
**CUANDO** se renderiza el gráfico
**ENTONCES** cada barra expone su valor como texto accesible para lectores de pantalla.

## Reglas de negocio

- RN-1 — Una póliza cuenta como producción del mes de su fecha de expedición.
- RN-2 — La cartera por ramo suma sólo pólizas vigentes.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/dashboard/produccion?meses=6` | Serie mensual |
| GET | `/api/dashboard/cartera-ramo` | Agregado por ramo |

## Hecho cuando

- [ ] Unitarias de la agregación mensual y por ramo, incluyendo meses vacíos.
- [ ] E2E `e2e/hu-023-produccion-cartera.spec.ts`: CA-1, CA-2, CA-4.
