# Brief — HU-015 · Cálculo de prima, IVA y comisión

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-015-calculo-prima` |
| **HU fuente** | `docs/hu/HU-015-calculo-prima.md` |
| **Épica** | E5 — Pólizas, emisión |
| **Prioridad** | Must |
| **Depende de** | HU-005, HU-014 |
| **Capacidad** | `liquidacion-polizas` (ADDED) |

## Intención

Es el mayor riesgo del producto: si la liquidación está mal, la agencia cobra o paga mal. Hoy el
cálculo vive en `app/src/data/helpers.ts` con constantes fijas (IVA 19 %, comisión 30 %, gastos
mínimos de 5 000, valor asegurado igual a 40 veces la prima). Este cambio lo lleva al backend, lo
alimenta con la configuración real del ramo y de la aseguradora, y lo vuelve auditable.

## Alcance

- Descomposición de la prima total con IVA incluido en prima neta e IVA, con redondeo al peso.
- IVA del ramo, incluido el caso de ramo sin IVA.
- Comisión según el porcentaje del ramo para la aseguradora de la póliza, sobre la base configurada.
- Gastos de expedición y su IVA cuando el ramo lo exige.
- Retenciones de la aseguradora (retención, retención de IVA, ICA) y comisión neta resultante.
- Formato de moneda en pesos colombianos, sin decimales.
- Rechazo de primas cero o negativas.
- Congelado de la liquidación junto con la póliza.

## Fuera de alcance

- El reparto de la comisión con el vendedor: HU-018.
- La interfaz del asistente y del detalle: HU-014 y HU-013 sólo muestran estos valores.
- Financiación, cuotas o planes de pago.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Descomposición de la prima | Prima total con IVA incluido |
| CA-2 | Ramo sin IVA | IVA marcado como no aplicable |
| CA-3 | Comisión del ramo por aseguradora | Porcentaje configurado en HU-005 |
| CA-4 | Gastos de expedición con IVA | Marca activa en el ramo |
| CA-5 | Retenciones de la aseguradora | Retención, retención de IVA e ICA configuradas |
| CA-6 | Formato de moneda | Presentación de cualquier valor monetario |
| CA-7 | Prima no válida | Prima cero o negativa |

## Reglas para el `design.md`

- RN-1 — Todos los cálculos se hacen en el backend; el frontend sólo muestra.
- RN-2 — Aritmética decimal exacta (`Decimal`), nunca punto flotante; se redondea al peso al final,
  no en cada paso intermedio.
- RN-3 — La liquidación se guarda con la póliza: recalcular después no cambia el histórico.
- Invariante que debe probarse: `prima_neta + iva = prima_total` después del redondeo.
- Referencia del prototipo (a confirmar como regla o como dato de configuración): neta = prima / 1,19;
  gastos = máx(5 000; prima × 0,3 %); valor asegurado = prima × 40.

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/polizas/liquidar` | Previsualiza la liquidación sin guardar |

## Reutilización visual

- Sin pantallas propias: los valores se muestran en la tarjeta lateral del detalle (`.side-card`,
  `.kv`, `.money`) y en el paso 3 del asistente (`.sum`).
- El formato de moneda se centraliza en un solo utilitario del frontend, alimentado por el backend.

## Verificación

- Unitarias con casos de borde, **antes** de tocar la interfaz (mitigación de riesgo del backlog):
  IVA 0 %, redondeos de valores terminados en 0,5, retenciones combinadas, prima mínima, gastos por
  el mínimo fijo frente al porcentaje.
- E2E `e2e/specs/hu-015-calculo-prima.spec.ts`: valores mostrados en el paso 3 y en el detalle.
- Comprobación manual de la demo: liquidación del sistema contra un cálculo hecho a mano.

## Decisiones abiertas

1. **Base de la comisión (CA-3)**: "prima neta o agencia" — dónde se configura esa base: en el ramo
   (HU-005), en el vendedor (HU-017) o en ambos con precedencia. Es la decisión más importante del
   cambio; sin ella la spec queda ambigua.
2. **Valor asegurado**: en el prototipo es un múltiplo de la prima, pero en la realidad se captura.
   Confirmar que es un dato de entrada del asistente y no un cálculo.
3. **Gastos de expedición**: ¿se capturan por póliza, se configuran por ramo o se derivan con la
   fórmula del prototipo? La HU no lo define y CA-4 los da por existentes.
4. **Sobre qué se aplican las retenciones (CA-5)**: sobre la comisión bruta de la agencia, y en qué
   orden se acumulan.
5. **Cambio de porcentajes en el futuro**: RN-3 congela la liquidación; confirmar que el anexo que
   modifica valores (HU-027) genera una liquidación nueva en lugar de editar la anterior.
