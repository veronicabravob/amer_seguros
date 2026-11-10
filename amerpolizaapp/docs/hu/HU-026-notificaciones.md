# HU-026 — Notificaciones automáticas al cliente

|  |  |
|---|---|
| **Épica** | E7 — Operación masiva y comunicaciones |
| **Prioridad** | Could |
| **Depende de** | HU-010, HU-022 |

## Historia

**Como** agencia
**quiero** avisar automáticamente al cliente cuando su póliza está por vencer o tiene un cobro pendiente
**para** mejorar la renovación sin depender de la memoria del asesor.

## Contexto en el prototipo

En la ficha del cliente y en el formulario de creación existen los interruptores: póliza por vencer,
cobros por vencer, aviso de cancelación, tarjeta de cumpleaños y autorización de tratamiento de datos.

## Criterios de aceptación

### CA-1 — Aviso de vencimiento
**CUANDO** una póliza entra en los 30 días previos al vencimiento y el cliente tiene activo el aviso
**ENTONCES** el sistema envía la notificación y registra el envío en la actividad de la póliza.

### CA-2 — Respeto de la autorización de datos
**CUANDO** el cliente no autorizó el tratamiento de datos
**ENTONCES** no se le envía ninguna notificación automática, aunque los interruptores estén activos.

### CA-3 — Sin duplicados
**CUANDO** ya se envió el aviso de vencimiento de una póliza
**ENTONCES** no se vuelve a enviar por el mismo hecho.

### CA-4 — Fallo de envío
**CUANDO** el envío falla (correo inválido o servicio caído)
**ENTONCES** el sistema lo registra como fallido, lo reintenta hasta tres veces y lo reporta al asesor.

### CA-5 — Preferencias por cliente
**CUANDO** el asesor desactiva "cobros por vencer" para un cliente
**ENTONCES** ese cliente deja de recibir ese tipo de aviso y sigue recibiendo los demás.

## Reglas de negocio

- RN-1 — Sin autorización de tratamiento de datos no hay envío (Ley 1581 de 2012).
- RN-2 — Los envíos se ejecutan una vez al día en un proceso programado.
- RN-3 — Cada envío queda registrado con fecha, canal, destinatario y resultado.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/notificaciones?cliente=` | Historial de envíos |
| POST | `/api/notificaciones/procesar` | Ejecuta el proceso diario (tarea programada) |

## Hecho cuando

- [ ] Unitarias: selección de destinatarios, bloqueo por autorización, no duplicación, reintentos.
- [ ] E2E `e2e/hu-026-notificaciones.spec.ts`: cambio de preferencias y registro visible en la actividad.
