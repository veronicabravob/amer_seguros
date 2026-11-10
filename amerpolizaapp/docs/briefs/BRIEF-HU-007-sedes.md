# Brief — HU-007 · Gestionar sedes

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-007-sedes` |
| **HU fuente** | `docs/hu/HU-007-sedes.md` |
| **Épica** | E1 — Catálogos maestros |
| **Prioridad** | Must |
| **Depende de** | HU-001 |
| **Capacidad** | `sedes` (ADDED) |

## Intención

Usuarios (HU-019) y vendedores (HU-017) pertenecen a una sede, y la operación se reporta por
oficina. `config/SedesPage.tsx` ya muestra las tarjetas con la etiqueta PRINCIPAL y el conteo de
usuarios, pero sobre datos simulados. Este cambio introduce la entidad, su invariante de sede
principal única y el conteo calculado.

## Alcance

- Alta, edición y búsqueda de sedes con nombre, correo, teléfono y dirección.
- Marca de sede principal, con traslado automático cuando se marca otra.
- Conteo de usuarios asignados, calculado y no capturado.
- Bloqueo del borrado cuando la sede tiene usuarios.

## Fuera de alcance

- La asignación de usuarios y vendedores a sedes: HU-019 y HU-017.
- Reportes o filtros por sede en pólizas y tablero.
- Horarios, zonas geográficas o jerarquía entre sedes.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Registro de sede | Alta con nombre, correo y dirección válidos |
| CA-2 | Sede principal única | Marcar principal cuando ya existía otra |
| CA-3 | Correo válido | Formato de correo inválido |
| CA-4 | Borrado protegido | Sede con usuarios asignados |
| CA-5 | Búsqueda | Texto de nombre o ciudad |

## Reglas para el `design.md`

- RN-1 — Existe exactamente una sede principal cuando hay al menos una sede (invariante: también
  al crear la primera y al intentar desmarcar la única).
- RN-2 — El nombre de la sede es único.
- RN-3 — El conteo de usuarios se calcula desde la relación, no se almacena.

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/sedes?q=` | Listado con conteo de usuarios |
| POST | `/api/sedes` | Crear |
| PUT | `/api/sedes/{id}` | Editar |
| PATCH | `/api/sedes/{id}/principal` | Marcar como principal |

## Reutilización visual

- Pantalla existente `config/SedesPage.tsx`: tarjetas con `.card`, `.pad`, etiqueta con `.badge`,
  modal con `components/ui/Modal.tsx`, formulario con `.fgrid`, `.field`, `.inp`, `.switch`.
- `data-testid` en la etiqueta PRINCIPAL, el conteo de usuarios y el botón de guardar.

## Verificación

- Unitarias: invariante de sede principal única (incluido el traslado), bloqueo de borrado con
  usuarios, unicidad de nombre.
- E2E `e2e/specs/hu-007-sedes.spec.ts`: crear una sede y trasladar la marca PRINCIPAL.

## Decisiones abiertas

1. **Primera sede**: ¿se marca principal automáticamente al ser la única? El invariante lo sugiere;
   la HU no lo dice.
2. **Ciudad**: CA-5 busca por ciudad, pero el formulario sólo tiene "Dirección". ¿Se separa el
   campo ciudad o se busca dentro del texto de la dirección? Recomendado separarlo.
3. **Borrado**: ¿existe borrado real de sedes sin usuarios o sólo inactivación, como en el resto de
   los catálogos?
