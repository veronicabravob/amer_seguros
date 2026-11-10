# Brief — HU-010 · Ver detalle de cliente

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-010-detalle-cliente` |
| **HU fuente** | `docs/hu/HU-010-detalle-cliente.md` |
| **Épica** | E3 — Clientes |
| **Prioridad** | Should |
| **Depende de** | HU-008 |
| **Capacidad** | `clientes` (MODIFIED: ficha) |

## Intención

La ficha del cliente es la pantalla que se usa mientras se habla por teléfono: debe reunir datos,
pólizas, preferencias de aviso y actividad sin obligar a cambiar de sección.
`clientes/ClienteDetailPage.tsx` ya tiene la estructura, pero las pólizas se generan hoy con
`genPolizasFor` y la actividad es decorativa.

## Alcance

- Ficha con datos de identificación, contacto, ciudad y estado.
- Bloque de pólizas del cliente con número, ramo, aseguradora, prima y estado, cada una enlazada a
  su detalle.
- Estado vacío con la acción "Crear póliza" cuando no tiene ninguna.
- Interruptores de notificación persistidos.
- Actividad reciente del cliente.
- Manejo del cliente inexistente sin error técnico.

## Fuera de alcance

- Editar los datos o cambiar el estado desde la ficha: HU-011.
- El envío real de las notificaciones: HU-026.
- Documentos adjuntos del cliente (los archivos son de la póliza, HU-028).

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Ficha del cliente | Apertura de `/clientes/{id}` |
| CA-2 | Pólizas del cliente | Cliente con pólizas asociadas |
| CA-3 | Cliente sin pólizas | Estado vacío con acción de crear póliza |
| CA-4 | Preferencias de notificación | Cambio de un interruptor y recarga |
| CA-5 | Cliente inexistente | Identificador que no existe |

## Reglas para el `design.md`

- RN-1 — Se listan las pólizas donde el cliente es tomador **o** asegurado.
- RN-2 — La actividad reciente muestra los últimos 10 eventos, del más reciente al más antiguo.
- El bloque de pólizas respeta los permisos del rol (Recepción no ve valores de comisión, HU-020).

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/clientes/{id}` | Ficha con datos y preferencias |
| GET | `/api/clientes/{id}/polizas` | Pólizas del cliente |
| GET | `/api/clientes/{id}/actividad` | Últimos eventos |
| PATCH | `/api/clientes/{id}/notificaciones` | Actualizar preferencias |

## Reutilización visual

- Pantalla existente `clientes/ClienteDetailPage.tsx`.
- Clases: `.det-hd`, `.det-title`, `.det-meta`, `.info-grid`, `.info-item`, `.kv`, `.card`,
  `.side-card`, `.switch`, `.timeline`, `.tl-item`, `.empty`, `.badge` de estado.
- `data-testid` en el bloque de pólizas, en cada interruptor y en el estado vacío.

## Verificación

- Unitarias del armado de la ficha, del estado vacío y del límite de 10 eventos.
- E2E `e2e/specs/hu-010-detalle-cliente.spec.ts`: CA-1, CA-2, CA-3 y CA-5.

## Decisiones abiertas

1. **Origen de la actividad**: ¿la misma bitácora de auditoría de HU-011 y HU-020, o un registro de
   eventos propio? Conviene una sola fuente para cliente, póliza (HU-013) e historial (HU-030).
2. **Orden del cambio respecto al backlog**: CA-2 necesita pólizas reales, que llegan en E4. Opción
   recomendada: especificar aquí y, mientras E4 no exista, servir el bloque vacío con CA-3, dejando
   la prueba de CA-2 marcada como pendiente.
3. **Preferencias sin autorización de datos**: ¿los interruptores se deshabilitan cuando el cliente
   no autorizó el tratamiento, o se guardan y se ignoran al enviar? La segunda es la que describe
   HU-026 CA-2.
