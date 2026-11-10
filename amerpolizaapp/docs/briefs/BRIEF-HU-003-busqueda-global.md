# Brief — HU-003 · Búsqueda global

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-003-busqueda-global` |
| **HU fuente** | `docs/hu/HU-003-busqueda-global.md` |
| **Épica** | E0 — Fundación y acceso |
| **Prioridad** | Should |
| **Depende de** | HU-002, HU-012 |
| **Capacidad** | `busqueda-global` (ADDED) |

## Intención

La barra superior ya tiene el campo "Buscar póliza, cliente, documento…" conectado a
`SearchContext`, pero filtra en memoria sólo el listado de pólizas del prototipo. Este cambio lo
convierte en una búsqueda contra el API, con normalización de acentos y mayúsculas, y define cómo
convive con los filtros ya aplicados.

## Alcance

- Búsqueda por número de póliza, nombre de cliente, documento y aseguradora.
- Normalización: insensible a mayúsculas y a acentos.
- Intersección con los filtros activos y conteo del encabezado sobre el total filtrado.
- Estado vacío con el texto buscado y acción para limpiar.
- Persistencia del texto al alternar entre vista tabla y tarjetas.

## Fuera de alcance

- Buscar clientes o registros de configuración desde la barra superior: el alcance de la HU es el
  listado de pólizas.
- Sugerencias en desplegable, historial de búsquedas o resaltado de coincidencias.
- Búsqueda de texto libre en observaciones o documentos adjuntos.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Búsqueda por número de póliza | Texto parcial de número |
| CA-2 | Búsqueda por cliente o documento | Texto parcial de nombre o documento |
| CA-3 | Búsqueda sin resultados | Estado vacío con acción de limpiar |
| CA-4 | Normalización de mayúsculas y acentos | "andina", "ANDINA" y "Andina" |
| CA-5 | Convivencia con los filtros | Filtro de estado activo más texto de búsqueda |

## Reglas para el `design.md`

- RN-1 — Se busca con dos caracteres o más, con retardo de 300 ms.
- RN-2 — Campos buscados: número de póliza, nombre de cliente, documento y aseguradora.
- RN-3 — El texto buscado se conserva al cambiar de vista tabla/tarjetas.
- La búsqueda y los filtros se combinan por intersección, nunca se sustituyen.

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/polizas?q=<texto>` | Búsqueda con paginación del lado del servidor |

## Reutilización visual

- `app/src/components/layout/Topbar.tsx` y `app/src/context/SearchContext.tsx` ya existen.
- Estado vacío con la clase `.empty`; contador del encabezado como está hoy.
- `data-testid` en el campo de búsqueda, en el contador y en el estado vacío.

## Verificación

- Unitarias de la normalización (minúsculas y acentos) y del predicado de coincidencia.
- E2E `e2e/specs/hu-003-busqueda-global.spec.ts`: CA-1 a CA-5, sin `waitForTimeout` (se espera por
  el resultado, no por el retardo).

## Decisiones abiertas

1. **Orden respecto al backlog**: la HU depende de HU-012, que está en E4. Opciones: (a) mover este
   cambio a E4 y cerrar E0 sin él, o (b) implementarlo en E0 contra el listado con datos simulados
   y reespecificarlo al conectar el API. Recomendado **(a)**; decidirlo antes de abrir el cambio.
2. **Dónde se normaliza el acento**: `unaccent` de PostgreSQL frente a normalización en Python. La
   primera exige la extensión instalada en la base de datos y en CI.
3. **Alcance de la coincidencia**: ¿"contiene" en todos los campos o "empieza por" en el número?
   Afecta al índice y al rendimiento con volumen real.
