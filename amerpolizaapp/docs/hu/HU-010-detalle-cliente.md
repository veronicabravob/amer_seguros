# HU-010 — Ver detalle de cliente

|  |  |
|---|---|
| **Épica** | E2 — Clientes |
| **Prioridad** | Should |
| **Depende de** | HU-008 |

## Historia

**Como** asesor comercial
**quiero** abrir la ficha de un cliente con sus datos, sus pólizas y su actividad
**para** atender una llamada sin cambiar de pantalla.

## Contexto en el prototipo

`clientes/ClienteDetailPage.tsx`: encabezado con avatar e identificación, bloques "Datos del cliente",
"Pólizas activas" (generadas hoy por `genPolizasFor`), "Notificaciones al cliente" (póliza por vencer,
cobros por vencer, aviso de cancelación, tarjeta de cumpleaños, autoriza datos) y "Actividad reciente".

## Criterios de aceptación

### CA-1 — Datos del cliente
**CUANDO** el asesor abre `/clientes/{id}`
**ENTONCES** ve nombre, tipo, documento, contacto, ciudad y estado del cliente.

### CA-2 — Pólizas del cliente
**CUANDO** el cliente tiene pólizas asociadas
**ENTONCES** la ficha lista cada póliza con número, ramo, aseguradora, prima y estado, y cada una abre su detalle.

### CA-3 — Cliente sin pólizas
**CUANDO** el cliente no tiene pólizas
**ENTONCES** el bloque muestra el estado vacío "Este cliente aún no tiene pólizas" con la acción "Crear póliza".

### CA-4 — Preferencias de notificación
**CUANDO** el asesor cambia un interruptor de notificación
**ENTONCES** la preferencia queda guardada y se refleja al recargar la ficha.

### CA-5 — Cliente inexistente
**CUANDO** abre un id que no existe
**ENTONCES** el sistema muestra "Cliente no encontrado" con un enlace al listado, en vez de un error técnico.

## Reglas de negocio

- RN-1 — Las pólizas listadas son las del cliente como tomador o como asegurado.
- RN-2 — La actividad reciente muestra los últimos 10 eventos, del más reciente al más antiguo.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/clientes/{id}` | Ficha con datos y preferencias |
| GET | `/api/clientes/{id}/polizas` | Pólizas del cliente |
| GET | `/api/clientes/{id}/actividad` | Últimos eventos |
| PATCH | `/api/clientes/{id}/notificaciones` | Actualizar preferencias |

## Hecho cuando

- [ ] Unitarias del armado de la ficha y del estado vacío.
- [ ] E2E `e2e/hu-010-detalle-cliente.spec.ts`: CA-1, CA-2, CA-3, CA-5.
