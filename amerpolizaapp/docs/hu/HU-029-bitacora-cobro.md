# HU-029 — Bitácora de cobro

|  |  |
|---|---|
| **Épica** | E8 — Expediente de la póliza |
| **Prioridad** | Should |
| **Depende de** | HU-013, HU-020 |

## Historia

**Como** usuario de Cobros
**quiero** registrar cada gestión de cobro sobre una póliza
**para** saber qué se le ha dicho al cliente y cuándo volver a llamarlo.

## Criterios de aceptación

### CA-1 — Registrar gestión
**CUANDO** el usuario de Cobros registra una gestión con canal, resultado, observación y fecha de próximo contacto
**ENTONCES** la gestión aparece en la bitácora ordenada de la más reciente a la más antigua.

### CA-2 — Estado de cobro de la póliza
**CUANDO** registra el resultado "Pago comprometido"
**ENTONCES** la póliza muestra el estado de cobro correspondiente y la fecha comprometida.

### CA-3 — Registro de pago
**CUANDO** registra un pago con valor y fecha
**ENTONCES** el saldo pendiente de la póliza disminuye y el evento queda en la actividad.

### CA-4 — Permisos
**CUANDO** un asesor comercial consulta la bitácora
**ENTONCES** la ve en modo lectura y no puede registrar gestiones.

### CA-5 — Próximo contacto en la bandeja
**CUANDO** llega la fecha de próximo contacto
**ENTONCES** la póliza aparece en la bandeja "Requiere tu atención" como cobro pendiente.

## Reglas de negocio

- RN-1 — Canales: llamada, WhatsApp, correo, visita.
- RN-2 — Una gestión registrada no se edita ni se borra; se corrige con una nueva gestión.
- RN-3 — El valor del pago no puede exceder el saldo pendiente.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET/POST | `/api/polizas/{id}/cobros` | Bitácora y registro de gestión |
| POST | `/api/polizas/{id}/pagos` | Registrar pago |

## Hecho cuando

- [ ] Unitarias: cálculo de saldo, inmutabilidad de la gestión, permisos por rol.
- [ ] E2E `e2e/hu-029-bitacora-cobro.spec.ts`: registrar gestión y verificarla en la bandeja.
