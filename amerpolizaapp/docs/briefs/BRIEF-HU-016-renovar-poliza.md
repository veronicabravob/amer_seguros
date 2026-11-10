# Brief — HU-016 · Renovar póliza

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-016-renovar-poliza` |
| **HU fuente** | `docs/hu/HU-016-renovar-poliza.md` |
| **Épica** | E6 — Vendedores y comisiones |
| **Prioridad** | Should |
| **Depende de** | HU-013, HU-014 |
| **Capacidad** | `renovacion-polizas` (ADDED) · `polizas` (MODIFIED: cadena de vigencias) |

## Intención

La renovación es el ingreso recurrente de la agencia y hoy obliga a recapturar la póliza entera.
Este cambio la convierte en una acción de un clic que hereda los datos, propone la nueva vigencia,
enlaza las dos pólizas y cierra la anterior, de modo que la bandeja de pendientes (HU-022) refleje
la realidad de inmediato.

## Alcance

- Acción "Renovar" desde el detalle de la póliza y desde la bandeja del tablero.
- Asistente precargado con cliente, aseguradora, ramo, riesgo y asesor, y vigencia propuesta desde
  el día siguiente al vencimiento.
- Etiqueta RENOV y enlace bidireccional con la póliza de origen.
- Cierre de la póliza anterior como renovada y su salida de la bandeja de atención.
- Recálculo de la liquidación cuando cambia la prima.
- Bloqueo de la acción en pólizas no renovables o vencidas hace demasiado tiempo.

## Fuera de alcance

- Renovación masiva de varias pólizas a la vez: HU-024.
- Aviso automático al cliente de la renovación: HU-026.
- Renegociación de condiciones con la aseguradora.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Renovación con datos heredados | Acción "Renovar" sobre una póliza vigente |
| CA-2 | Marca y enlace de renovación | Confirmación de la renovación |
| CA-3 | Cierre de la póliza anterior | Emisión de la renovación |
| CA-4 | Póliza no renovable | Marca de no renovable o motivo registrado |
| CA-5 | Ajuste de prima al renovar | Cambio de prima con recálculo |

## Reglas para el `design.md`

- RN-1 — La nueva vigencia inicia el día siguiente al vencimiento de la anterior, salvo ajuste manual.
- RN-2 — La cadena de renovaciones se consulta desde el historial de la póliza (HU-030).
- RN-3 — Sólo se renuevan pólizas Vigentes o Por vencer; una vencida hace más de 30 días exige
  emisión nueva.
- El recálculo usa los porcentajes **vigentes** del ramo y la aseguradora, no los congelados de la
  póliza de origen (matiz importante frente a HU-015 RN-3).

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/polizas/{id}/renovar` | Crea la póliza renovada enlazada |

## Reutilización visual

- Se reutiliza el asistente de `polizas/PolizaCreatePage.tsx` en modo renovación, precargado.
- Acción "Renovar" ya presente en el encabezado de `PolizaDetailPage.tsx` (`.det-hd`, `.btn`).
- Etiqueta con la clase `.tag-ren`; explicación del bloqueo con `.hint` o `.empty`.
- `data-testid` en la acción Renovar, en la etiqueta RENOV y en el mensaje de no renovable.

## Verificación

- Unitarias: cálculo de la nueva vigencia (incluidos fin de mes y años bisiestos), enlace entre
  pólizas, restricciones de renovación, recálculo con porcentajes vigentes.
- E2E `e2e/specs/hu-016-renovar-poliza.spec.ts`: CA-1, CA-2 y CA-4.
- Demo de la épica: renovar una póliza y ver que sale de la bandeja "Requiere tu atención".

## Decisiones abiertas

1. **Número de la póliza renovada**: ¿se conserva el mismo número, se propone uno nuevo o lo asigna
   la aseguradora? CA-1 no lo menciona y HU-014 RN-1 exige unicidad por aseguradora: si se conserva
   el número, la regla de unicidad debe contemplar la cadena de renovaciones.
2. **Estado de la póliza anterior (CA-3)**: ¿un estado "Renovada" propio o la marca del enlace?
   Afecta a los chips del listado (HU-012) y a los indicadores (HU-021).
3. **"Motivo de no renovación" (CA-4)**: viene del catálogo de motivos (HU-006). Definir dónde se
   registra ese motivo en la póliza, porque hoy no existe esa acción en ninguna HU.
