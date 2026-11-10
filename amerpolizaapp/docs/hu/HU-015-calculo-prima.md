# HU-015 — Cálculo de prima, IVA y comisión

|  |  |
|---|---|
| **Épica** | E3 — Pólizas |
| **Prioridad** | Must |
| **Depende de** | HU-005, HU-014 |

## Historia

**Como** agencia
**quiero** que el sistema calcule prima neta, gastos, IVA, comisión y total
**para** que la liquidación de cada póliza sea consistente y auditable.

## Contexto en el prototipo

`data/helpers.ts` calcula hoy, a partir de la prima con IVA incluido: neta = prima / 1.19,
IVA = prima − neta, comisión = neta × 30 %, gastos = máx(5 000, prima × 0,3 %) y valor asegurado
= prima × 40. Se muestran en la tarjeta lateral del detalle y en el paso 3 del asistente.

## Criterios de aceptación

### CA-1 — Descomposición de la prima
**CUANDO** se registra una prima total con IVA incluido
**ENTONCES** el sistema calcula la prima neta y el IVA de modo que neta + IVA = total, con redondeo a peso.

### CA-2 — Porcentaje de IVA del ramo
**CUANDO** el ramo tiene IVA marcado como no aplicable
**ENTONCES** el IVA es cero y la prima neta es igual al total.

### CA-3 — Comisión según ramo y aseguradora
**CUANDO** el ramo define un porcentaje de comisión para la aseguradora de la póliza
**ENTONCES** la comisión se calcula sobre la base configurada (prima neta o agencia) con ese porcentaje.

### CA-4 — Gastos de expedición
**CUANDO** el ramo tiene activo "Calcular IVA a gastos de expedición"
**ENTONCES** el IVA de los gastos se suma al total a pagar.

### CA-5 — Retenciones de la aseguradora
**CUANDO** la aseguradora tiene retención, retención de IVA o ICA configuradas
**ENTONCES** el sistema descuenta esos porcentajes de la comisión y muestra la comisión neta.

### CA-6 — Formato de moneda
**CUANDO** se presenta cualquier valor monetario
**ENTONCES** se muestra en pesos colombianos con separador de miles y sin decimales (por ejemplo `$ 14.880.000`).

### CA-7 — Valores no negativos
**CUANDO** se intenta registrar una prima negativa o cero
**ENTONCES** el sistema la rechaza.

## Reglas de negocio

- RN-1 — Todos los cálculos se hacen en el backend; el frontend sólo muestra.
- RN-2 — Se usa aritmética decimal exacta, no punto flotante, y se redondea al peso al final.
- RN-3 — La liquidación se guarda con la póliza: recalcularla después no debe cambiar el histórico.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/polizas/liquidar` | Previsualiza la liquidación sin guardar |

## Hecho cuando

- [ ] Unitarias con casos de borde: IVA 0 %, redondeos, retenciones combinadas, prima mínima.
- [ ] E2E `e2e/hu-015-calculo-prima.spec.ts`: verificación de los valores mostrados en el paso 3 y en el detalle.
