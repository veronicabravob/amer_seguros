# Brief — HU-025 · Exportar listados

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-025-exportar` |
| **HU fuente** | `docs/hu/HU-025-exportar.md` |
| **Épica** | E8 — Operación masiva y comunicaciones |
| **Prioridad** | Should |
| **Depende de** | HU-024 |
| **Capacidad** | `exportaciones` (ADDED) · `control-acceso` (MODIFIED: columnas por rol) |

## Intención

La agencia sigue trabajando con hojas de cálculo para informes y cruces, y hoy tiene que copiar a
mano lo que ve en pantalla. Este cambio permite bajar exactamente lo que está filtrado o
seleccionado, respetando los permisos: quien no ve comisiones en pantalla tampoco las recibe en el
archivo.

## Alcance

- Exportación del listado filtrado y de la selección, en pólizas y clientes.
- Columnas iguales a las visibles, recortadas según el rol.
- Nombre de archivo con módulo y fecha.
- Aviso cuando no hay registros que exportar.
- Formatos XLSX y CSV UTF-8; exportaciones grandes en segundo plano con aviso al terminar.
- Auditoría de cada exportación.

## Fuera de alcance

- Plantillas personalizadas, selección manual de columnas o informes con formato.
- Exportación a PDF.
- Programación de exportaciones recurrentes.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Exportación del listado filtrado | Filtros activos |
| CA-2 | Exportación de la selección | Registros seleccionados |
| CA-3 | Nombre del archivo | Descarga con módulo y fecha |
| CA-4 | Columnas sensibles según rol | Usuario sin permiso sobre comisiones |
| CA-5 | Exportación vacía | Ningún registro que exportar |

## Reglas para el `design.md`

- RN-1 — Formatos XLSX y CSV, separador coma y codificación UTF-8 (con BOM si Excel lo requiere).
- RN-2 — Más de 5 000 filas se generan en segundo plano y se notifican al terminar.
- RN-3 — Cada exportación se audita con usuario, filtros y número de registros.
- Las columnas se construyen en el backend a partir de la misma matriz de permisos de HU-020: no se
  filtran en el frontend.

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/exportar/{modulo}` | Genera el archivo según filtros o identificadores |

## Reutilización visual

- Acción ya presente en la barra de acciones masivas y en la barra de herramientas del listado.
- Aviso de exportación vacía y de proceso en segundo plano con el patrón de mensajes existente
  (`.hint`, `.empty`); sin componentes de notificación nuevos salvo justificación en el `design.md`.
- `data-testid` en el botón exportar y en el aviso.

## Verificación

- Unitarias de la construcción de columnas por rol y del nombre del archivo (incluida la fecha).
- E2E `e2e/specs/hu-025-exportar.spec.ts`: descarga verificada con `page.waitForEvent('download')`
  y comprobación del nombre; el contenido se valida en las unitarias.

## Decisiones abiertas

1. **Segundo plano (RN-2)**: ¿con qué se ejecuta? Si no hay cola de tareas en el proyecto, esto
   introduce Celery o un `management command` programado, con su propia infraestructura en CI y en
   Docker. Alternativa: subir el umbral y generar siempre de forma síncrona en esta versión.
2. **Cómo se entrega el archivo grande**: ¿enlace de descarga temporal, correo, o bandeja de
   descargas en la aplicación? La HU dice "se notifican" sin definir el canal.
3. **Qué módulos exportan** en esta versión: pólizas y clientes son los que tienen listado; confirmar
   si también comisiones (HU-018).
