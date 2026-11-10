# HU-016 — Renovar póliza

|  |  |
|---|---|
| **Épica** | E3 — Pólizas |
| **Prioridad** | Should |
| **Depende de** | HU-013, HU-014 |

## Historia

**Como** asesor comercial
**quiero** renovar una póliza a partir de la anterior
**para** no volver a capturar todos los datos y conservar la trazabilidad entre vigencias.

## Criterios de aceptación

### CA-1 — Renovación con datos heredados
**CUANDO** el asesor presiona "Renovar" en una póliza
**ENTONCES** se abre el asistente precargado con cliente, aseguradora, ramo, riesgo y asesor, y con la nueva vigencia propuesta desde el día siguiente al vencimiento.

### CA-2 — Marca de renovación
**CUANDO** confirma la renovación
**ENTONCES** la nueva póliza queda con la etiqueta RENOV y enlazada a la póliza de origen.

### CA-3 — Cierre de la póliza anterior
**CUANDO** la renovación se emite
**ENTONCES** la póliza anterior queda marcada como renovada y deja de aparecer en la bandeja "Requiere tu atención".

### CA-4 — Póliza no renovable
**CUANDO** la póliza está marcada como no renovable o tiene un motivo de no renovación
**ENTONCES** la acción "Renovar" no está disponible y se explica por qué.

### CA-5 — Ajuste de prima en la renovación
**CUANDO** cambia la prima al renovar
**ENTONCES** la liquidación se recalcula con los porcentajes vigentes del ramo y la aseguradora.

## Reglas de negocio

- RN-1 — La nueva vigencia inicia el día siguiente al vencimiento de la anterior, salvo ajuste manual.
- RN-2 — La cadena de renovaciones es consultable desde el historial de la póliza.
- RN-3 — Sólo pólizas Vigentes o Por vencer pueden renovarse; una Vencida hace más de 30 días requiere emisión nueva.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/polizas/{id}/renovar` | Crea la póliza renovada enlazada |

## Hecho cuando

- [ ] Unitarias: cálculo de la nueva vigencia, enlace entre pólizas, restricciones de renovación.
- [ ] E2E `e2e/hu-016-renovar-poliza.spec.ts`: CA-1, CA-2, CA-4.
