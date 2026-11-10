# HU-027 — Anexos de póliza

|  |  |
|---|---|
| **Épica** | E8 — Expediente de la póliza |
| **Prioridad** | Should |
| **Depende de** | HU-013, HU-006 |

## Historia

**Como** asesor comercial
**quiero** registrar anexos que modifican una póliza vigente
**para** dejar constancia de cambios de valor asegurado, prórrogas o inclusiones.

## Contexto en el prototipo

Pestaña "Anexos" del detalle de póliza (hoy con contador 2 y contenido de marcador de posición) y
catálogo de motivos con la marca "Creación de anexo" (HU-006).

## Criterios de aceptación

### CA-1 — Crear anexo
**CUANDO** el asesor registra un anexo con motivo, fecha y descripción
**ENTONCES** el anexo aparece en la pestaña, el contador aumenta y queda en la actividad de la póliza.

### CA-2 — Motivos válidos
**CUANDO** abre el selector de motivo
**ENTONCES** sólo se ofrecen los motivos marcados como "Creación de anexo".

### CA-3 — Anexo que cambia valores
**CUANDO** el anexo modifica prima o valor asegurado
**ENTONCES** la póliza muestra los valores actualizados y conserva los anteriores en el historial.

### CA-4 — Póliza no vigente
**CUANDO** la póliza está vencida o cancelada
**ENTONCES** no se permite crear anexos y se explica el motivo.

### CA-5 — Fecha del anexo
**CUANDO** captura una fecha fuera de la vigencia de la póliza
**ENTONCES** el sistema la rechaza.

## Reglas de negocio

- RN-1 — Un anexo siempre pertenece a una póliza y nunca cambia su número.
- RN-2 — Los anexos se numeran consecutivamente por póliza.
- RN-3 — Un anexo que modifica valores dispara una nueva liquidación (HU-015).

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET/POST | `/api/polizas/{id}/anexos` | Listar y crear |

## Hecho cuando

- [ ] Unitarias: consecutivo, validación de fecha y de estado de la póliza, recálculo.
- [ ] E2E `e2e/hu-027-anexos.spec.ts`: crear anexo y verificar contador e historial.
