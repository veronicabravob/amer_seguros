# Brief — HU-026 · Notificaciones automáticas al cliente

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-026-notificaciones` |
| **HU fuente** | `docs/hu/HU-026-notificaciones.md` |
| **Épica** | E8 — Operación masiva y comunicaciones |
| **Prioridad** | Could |
| **Depende de** | HU-010, HU-022 |
| **Capacidad** | `notificaciones-cliente` (ADDED) |

## Intención

La renovación depende hoy de que el asesor se acuerde de llamar. Las preferencias por cliente ya se
capturan (HU-009 y HU-010), pero nadie las usa. Este cambio ejecuta el aviso de vencimiento y de
cobro con dos condiciones innegociables: respetar la autorización de tratamiento de datos y no
duplicar envíos.

## Alcance

- Proceso diario que selecciona destinatarios y envía los avisos configurados.
- Aviso de póliza por vencer dentro de los 30 días y aviso de cobro pendiente.
- Bloqueo total del envío cuando el cliente no autorizó el tratamiento de datos.
- Control de duplicados por hecho notificable.
- Reintentos ante fallo y reporte al asesor.
- Registro de cada envío en la actividad de la póliza y en el historial de notificaciones.
- Respeto de las preferencias por tipo de aviso de cada cliente.

## Fuera de alcance

- Envío manual o masivo desde la interfaz ("Enviar email" de HU-024).
- Canales distintos del correo (WhatsApp, SMS) y plantillas editables por el usuario.
- Tarjeta de cumpleaños: existe como interruptor pero no tiene criterio de aceptación.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Aviso de vencimiento | Póliza entra en los 30 días previos con aviso activo |
| CA-2 | Respeto de la autorización de datos | Cliente sin autorización, interruptores activos |
| CA-3 | Sin duplicados | Aviso ya enviado por el mismo hecho |
| CA-4 | Fallo de envío | Correo inválido o servicio caído |
| CA-5 | Preferencias por tipo | Desactivación de "cobros por vencer" |

## Reglas para el `design.md`

- RN-1 — Sin autorización de tratamiento de datos no hay envío (Ley 1581 de 2012). Es una barrera de
  cumplimiento, no una preferencia: se valida en el servicio de envío, no en la interfaz.
- RN-2 — Los envíos se ejecutan una vez al día en un proceso programado.
- RN-3 — Cada envío se registra con fecha, canal, destinatario y resultado.
- Máximo tres reintentos por envío fallido (CA-4).
- En desarrollo y en pruebas no se envía correo real: backend de consola o de memoria.

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/notificaciones?cliente=` | Historial de envíos |
| POST | `/api/notificaciones/procesar` | Ejecuta el proceso diario (tarea programada) |

## Reutilización visual

- Interruptores ya existentes en `ClienteFormPage.tsx` y `ClienteDetailPage.tsx` (`.switch`).
- El registro de envíos se muestra en la actividad de la póliza y del cliente (`.timeline`,
  `.tl-item`); sin pantalla nueva.
- `data-testid` en cada interruptor y en las entradas de envío de la actividad.

## Verificación

- Unitarias: selección de destinatarios, bloqueo por falta de autorización, no duplicación,
  reintentos, respeto de preferencias por tipo.
- E2E `e2e/specs/hu-026-notificaciones.spec.ts`: cambio de preferencias y registro visible en la
  actividad; el envío se verifica con el backend de correo de pruebas, no con un buzón real.

## Decisiones abiertas

1. **Quién dispara el proceso**: `manage.py` ejecutado por un programador externo (cron del
   servidor), o una cola de tareas. Conviene resolverlo junto con la decisión equivalente de HU-025.
2. **Proveedor de correo**: SMTP propio o servicio externo. Afecta a las variables de entorno, al
   `.env.example` y a las credenciales que nunca entran al repositorio.
3. **Definición del "hecho notificable" (CA-3)**: la clave que evita duplicados (póliza + tipo de
   aviso + vigencia, por ejemplo). Sin ella la regla no es verificable.
4. **Contenido del mensaje**: quién redacta las plantillas y si llevan datos sensibles del cliente;
   revisar contra `docs/DATOS.md`.
