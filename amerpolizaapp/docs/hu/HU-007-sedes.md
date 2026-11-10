# HU-007 — Gestionar sedes

|  |  |
|---|---|
| **Épica** | E1 — Catálogos maestros |
| **Prioridad** | Must |
| **Depende de** | HU-001 |

## Historia

**Como** administrador
**quiero** registrar las sedes de la agencia y marcar cuál es la principal
**para** asignar usuarios y vendedores a su sede y separar la operación por oficina.

## Contexto en el prototipo

`config/SedesPage.tsx`: tarjetas/tabla con nombre, email, teléfono, dirección, número de usuarios
y la etiqueta **PRINCIPAL**; modal "Crear sede" con Nombre, Email, Teléfono, Dirección y la casilla
"Marcar como sede principal".

## Criterios de aceptación

### CA-1 — Crear sede
**CUANDO** el administrador guarda una sede con nombre, email y dirección válidos
**ENTONCES** la sede aparece en el listado con cero usuarios asignados.

### CA-2 — Una sola sede principal
**CUANDO** marca como principal una sede y ya existía otra principal
**ENTONCES** la anterior deja de serlo automáticamente y sólo una queda con la etiqueta PRINCIPAL.

### CA-3 — Correo válido
**CUANDO** captura un correo con formato inválido
**ENTONCES** el sistema marca el campo y no guarda.

### CA-4 — No eliminar sede con usuarios
**CUANDO** intenta eliminar una sede que tiene usuarios asignados
**ENTONCES** el sistema lo impide e indica cuántos usuarios debe reasignar primero.

### CA-5 — Buscar sede
**CUANDO** escribe en el buscador
**ENTONCES** el listado filtra por nombre o ciudad de la dirección.

## Reglas de negocio

- RN-1 — Siempre existe exactamente una sede principal cuando hay al menos una sede.
- RN-2 — El nombre de la sede es único.
- RN-3 — El conteo de usuarios de la sede se calcula, no se captura.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/sedes?q=` | Listado con conteo de usuarios |
| POST | `/api/sedes` | Crear |
| PUT | `/api/sedes/{id}` | Editar |
| PATCH | `/api/sedes/{id}/principal` | Marcar como principal |

## Hecho cuando

- [ ] Unitarias: invariante de sede principal única, bloqueo de borrado con usuarios.
- [ ] E2E `e2e/hu-007-sedes.spec.ts`: crear sede y trasladar la marca PRINCIPAL.
