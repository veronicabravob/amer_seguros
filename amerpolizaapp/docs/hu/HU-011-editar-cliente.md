# HU-011 — Editar cliente y cambiar su estado

|  |  |
|---|---|
| **Épica** | E2 — Clientes |
| **Prioridad** | Should |
| **Depende de** | HU-009, HU-010 |

## Historia

**Como** asesor comercial
**quiero** actualizar los datos de un cliente y cambiar su estado
**para** mantener la información al día y reflejar si sigue siendo cliente activo.

## Criterios de aceptación

### CA-1 — Editar datos de contacto
**CUANDO** el asesor cambia teléfono o correo y guarda
**ENTONCES** el sistema persiste el cambio, lo muestra en la ficha y registra el evento en la actividad del cliente.

### CA-2 — Documento no editable con pólizas
**CUANDO** intenta cambiar el número de documento de un cliente con pólizas emitidas
**ENTONCES** el sistema lo impide e indica que debe solicitarse una corrección administrativa.

### CA-3 — Inactivar cliente
**CUANDO** cambia el estado a Inactivo
**ENTONCES** el cliente deja de aparecer en el selector de nuevas pólizas y se conserva en el histórico.

### CA-4 — Inactivación bloqueada
**CUANDO** intenta inactivar un cliente con pólizas vigentes
**ENTONCES** el sistema lo impide e informa cuántas pólizas vigentes tiene.

### CA-5 — Trazabilidad del cambio
**CUANDO** guarda cualquier cambio
**ENTONCES** queda registrado quién lo hizo, cuándo, y qué campos cambiaron.

## Reglas de negocio

- RN-1 — Cambios de estado permitidos: Prospecto→Cliente, Cliente→Inactivo, Inactivo→Cliente.
- RN-2 — Toda edición genera un registro de auditoría con valores anterior y nuevo.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| PUT | `/api/clientes/{id}` | Editar |
| PATCH | `/api/clientes/{id}/estado` | Cambiar estado |

## Hecho cuando

- [ ] Unitarias: transiciones de estado válidas, bloqueo por pólizas vigentes, registro de auditoría.
- [ ] E2E `e2e/hu-011-editar-cliente.spec.ts`: CA-1, CA-3, CA-4.
