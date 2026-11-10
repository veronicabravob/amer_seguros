# Brief — HU-011 · Editar cliente y cambiar su estado

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-011-editar-cliente` |
| **HU fuente** | `docs/hu/HU-011-editar-cliente.md` |
| **Épica** | E3 — Clientes |
| **Prioridad** | Should |
| **Depende de** | HU-009, HU-010 |
| **Capacidad** | `clientes` (MODIFIED: edición, estados y auditoría) |

## Intención

Los datos de contacto cambian y los clientes dejan de serlo; sin edición ni ciclo de estado la
base envejece y el sistema deja de ser confiable. Este cambio también introduce la primera
auditoría real del proyecto: quién cambió qué y cuándo.

## Alcance

- Edición de los datos del cliente, en particular contacto.
- Ciclo de estado Prospecto → Cliente → Inactivo → Cliente, con las restricciones.
- Bloqueo del cambio de documento cuando el cliente ya tiene pólizas emitidas.
- Bloqueo de la inactivación cuando tiene pólizas vigentes, informando cuántas.
- Registro de auditoría con valores anterior y nuevo, visible en la actividad del cliente.

## Fuera de alcance

- Eliminar clientes: no existe borrado.
- Fusionar clientes duplicados.
- Corrección administrativa del documento (CA-2 la menciona como proceso externo, sin definirla).

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Edición de datos de contacto | Cambio de teléfono o correo |
| CA-2 | Documento no editable con pólizas | Intento de cambiar el documento |
| CA-3 | Inactivación de cliente | Cambio de estado a Inactivo |
| CA-4 | Inactivación bloqueada | Cliente con pólizas vigentes |
| CA-5 | Trazabilidad del cambio | Cualquier guardado registra autor, fecha y campos |

## Reglas para el `design.md`

- RN-1 — Transiciones permitidas: Prospecto → Cliente, Cliente → Inactivo, Inactivo → Cliente.
  Cualquier otra se rechaza.
- RN-2 — Toda edición genera un registro de auditoría con valor anterior y nuevo.
- Un cliente Inactivo desaparece del selector de nuevas pólizas y permanece en el histórico.
- La edición respeta los permisos de HU-020.

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| PUT | `/api/clientes/{id}` | Editar |
| PATCH | `/api/clientes/{id}/estado` | Cambiar estado |

## Reutilización visual

- Se reutiliza `clientes/ClienteFormPage.tsx` en modo edición; sin pantalla nueva.
- Confirmación de cambio de estado con `components/ui/Modal.tsx`.
- Los eventos de auditoría se muestran en el bloque de actividad de la ficha (`.timeline`).

## Verificación

- Unitarias: transiciones válidas e inválidas, bloqueo por pólizas vigentes, contenido del registro
  de auditoría.
- E2E `e2e/specs/hu-011-editar-cliente.spec.ts`: CA-1, CA-3 y CA-4.

## Decisiones abiertas

1. **Modelo de auditoría**: dónde vive (ver la decisión equivalente en HU-020) y qué campos guarda.
   Debe resolverse antes de escribir el `design.md`, porque HU-024 y HU-030 lo reutilizan.
2. **Prospecto → Inactivo**: RN-1 no la contempla. ¿Se rechaza un prospecto que nunca compró, o se
   agrega la transición? Recomendado agregarla explícitamente a la HU si se necesita.
3. **Qué cuenta como "póliza vigente"** para CA-4: reutilizar la definición de HU-012 RN-1 para no
   tener dos reglas de vigencia en el sistema.
