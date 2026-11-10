# HU-018 — Comisión liquidada por póliza

|  |  |
|---|---|
| **Épica** | E4 — Vendedores y comisiones |
| **Prioridad** | Should |
| **Depende de** | HU-015, HU-017 |

## Historia

**Como** administrador
**quiero** ver cuánta comisión genera cada póliza y cuánto le corresponde al vendedor
**para** liquidar pagos sin hacer cuentas por fuera del sistema.

## Criterios de aceptación

### CA-1 — Comisión de agencia y del vendedor
**CUANDO** se consulta una póliza con vendedor asignado
**ENTONCES** el sistema muestra la comisión que paga la aseguradora a la agencia y la parte que corresponde al vendedor.

### CA-2 — Retenciones aplicadas
**CUANDO** el vendedor tiene retención o ICA configurados
**ENTONCES** el valor a pagar muestra la comisión bruta, las retenciones y el neto.

### CA-3 — Póliza sin vendedor
**CUANDO** la póliza no tiene vendedor asignado
**ENTONCES** la comisión de vendedor es cero y el sistema lo indica explícitamente.

### CA-4 — Consulta por vendedor y periodo
**CUANDO** el administrador consulta las comisiones de un vendedor en un rango de fechas
**ENTONCES** obtiene el listado de pólizas con su comisión y el total del periodo.

### CA-5 — Congelado histórico
**CUANDO** cambia el esquema de comisión del vendedor
**ENTONCES** las pólizas ya liquidadas conservan la comisión con la que se emitieron.

## Reglas de negocio

- RN-1 — La comisión del vendedor se calcula sobre la base definida en su esquema (HU-017).
- RN-2 — Los totales por periodo usan la fecha de expedición de la póliza.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/comisiones?vendedor=&desde=&hasta=` | Liquidación por periodo |
| GET | `/api/polizas/{id}/comision` | Detalle de comisión de la póliza |

## Hecho cuando

- [ ] Unitarias del cálculo con y sin retenciones y del congelado histórico.
- [ ] E2E `e2e/hu-018-comision-poliza.spec.ts`: consulta por vendedor y verificación del total.
