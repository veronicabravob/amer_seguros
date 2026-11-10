# Brief — HU-018 · Comisión liquidada por póliza

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-018-comision-poliza` |
| **HU fuente** | `docs/hu/HU-018-comision-poliza.md` |
| **Épica** | E6 — Vendedores y comisiones |
| **Prioridad** | Should |
| **Depende de** | HU-015, HU-017 |
| **Capacidad** | `comisiones` (ADDED) |

## Intención

Hoy la agencia liquida lo que le paga a cada vendedor por fuera del sistema, en hojas de cálculo.
Con la liquidación de la póliza (HU-015) y el esquema del vendedor (HU-017) ya especificados, este
cambio cierra el círculo: cuánto entra por cada póliza, cuánto le corresponde al vendedor y cuánto
suma el periodo.

## Alcance

- Cálculo de la comisión de agencia y de la comisión del vendedor por póliza.
- Aplicación de las retenciones del vendedor y presentación de bruto, retenciones y neto.
- Caso de póliza sin vendedor asignado.
- Consulta de comisiones por vendedor y rango de fechas, con total del periodo.
- Congelado histórico: cambiar el esquema del vendedor no altera lo ya liquidado.

## Fuera de alcance

- El pago, la cuenta de cobro y la conciliación contable (fuera del backlog).
- Comisiones de cobranza o bonificaciones por metas.
- Exportación del reporte: se apoya en HU-025 cuando exista.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Comisión de agencia y de vendedor | Póliza con vendedor asignado |
| CA-2 | Retenciones aplicadas | Vendedor con retención e ICA |
| CA-3 | Póliza sin vendedor | Comisión de vendedor en cero, indicada explícitamente |
| CA-4 | Consulta por vendedor y periodo | Rango de fechas con total |
| CA-5 | Congelado histórico | Cambio del esquema después de emitir |

## Reglas para el `design.md`

- RN-1 — La comisión del vendedor se calcula sobre la base definida en su esquema (HU-017).
- RN-2 — Los totales por periodo usan la fecha de expedición de la póliza.
- La comisión se guarda liquidada junto con la póliza, igual que el resto de la liquidación
  (HU-015 RN-3); el reporte por periodo lee valores guardados, no recalcula.
- Sólo el perfil Administrador ve valores de comisión (HU-020 RN-2).

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/comisiones?vendedor=&desde=&hasta=` | Liquidación por periodo |
| GET | `/api/polizas/{id}/comision` | Detalle de comisión de la póliza |

## Reutilización visual

- El detalle por póliza se muestra en la tarjeta lateral de `PolizaDetailPage.tsx` (`.side-card`,
  `.kv`, `.money`).
- La consulta por periodo reutiliza el patrón de listado: `.toolbar` con rango de fechas y
  selector de vendedor, `.tblwrap`, `.tbl`, fila de totales, `.empty`.
- Si se requiere pantalla nueva, el `design.md` debe declarar su sección de reutilización visual.

## Verificación

- Unitarias del cálculo con y sin retenciones, del caso sin vendedor y del congelado histórico.
- E2E `e2e/specs/hu-018-comision-poliza.spec.ts`: consulta por vendedor y verificación del total.
- Contraste manual con un cálculo hecho a mano, como en HU-015.

## Decisiones abiertas

1. **Dónde vive la consulta por periodo (CA-4)**: ¿pantalla nueva en Configuración, pestaña dentro
   del vendedor, o sección propia del menú? El prototipo no la tiene; define si hay pantalla nueva.
2. **Comisión de agencia frente a comisión de vendedor**: confirmar que la primera viene del ramo
   (HU-005) y la segunda del esquema del vendedor, y que la segunda nunca supera a la primera
   (¿se valida o se permite?).
3. **Periodo por fecha de expedición (RN-2)** frente a fecha de inicio de vigencia: verificar con la
   operación cuál usan hoy para pagar.
4. **Anexos y renovaciones**: ¿generan comisión propia? HU-027 dispara una nueva liquidación; hay
   que decir si eso suma al periodo.
