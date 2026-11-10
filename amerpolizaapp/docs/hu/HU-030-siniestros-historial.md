# HU-030 — Siniestros e historial de la póliza

|  |  |
|---|---|
| **Épica** | E8 — Expediente de la póliza |
| **Prioridad** | Could |
| **Depende de** | HU-013, HU-006 |

## Historia

**Como** asesor comercial
**quiero** registrar los siniestros de una póliza y consultar todo lo que le ha pasado
**para** acompañar al cliente durante la reclamación y responder auditorías.

## Contexto en el prototipo

Pestañas "Siniestros" e "Historial" del detalle de póliza y catálogo de estados de siniestro
con color (HU-006): Solicitado, En proceso, Objetado, Pagado.

## Criterios de aceptación

### CA-1 — Registrar siniestro
**CUANDO** el asesor registra un siniestro con fecha de ocurrencia, descripción y valor reclamado
**ENTONCES** el siniestro queda en estado "Solicitado" y el contador de la pestaña aumenta.

### CA-2 — Cambio de estado
**CUANDO** cambia el estado del siniestro
**ENTONCES** se registra quién lo cambió y cuándo, y la etiqueta toma el color configurado del estado.

### CA-3 — Fecha dentro de la vigencia
**CUANDO** la fecha de ocurrencia está fuera de la vigencia de la póliza
**ENTONCES** el sistema advierte y exige confirmación explícita para continuar.

### CA-4 — Historial completo
**CUANDO** abre la pestaña Historial
**ENTONCES** ve, en orden cronológico inverso, creación, anexos, renovaciones, cambios de estado, cargas de archivos y gestiones de cobro, cada uno con autor y fecha.

### CA-5 — Historial inalterable
**CUANDO** cualquier usuario consulta el historial
**ENTONCES** no existe forma de editar ni borrar sus registros desde la interfaz.

## Reglas de negocio

- RN-1 — Un siniestro pertenece a una sola póliza y conserva la trazabilidad de estados.
- RN-2 — El historial es de sólo escritura por el sistema (append-only).
- RN-3 — Los estados disponibles provienen del catálogo de estados de siniestro.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET/POST | `/api/polizas/{id}/siniestros` | Listar y crear |
| PATCH | `/api/siniestros/{id}/estado` | Cambiar estado |
| GET | `/api/polizas/{id}/historial` | Historial completo |

## Hecho cuando

- [ ] Unitarias: transición de estados, validación de fecha, inmutabilidad del historial.
- [ ] E2E `e2e/hu-030-siniestros-historial.spec.ts`: registrar siniestro, cambiar estado y verificar el historial.
