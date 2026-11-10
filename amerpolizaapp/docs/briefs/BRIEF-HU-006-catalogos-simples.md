# Brief — HU-006 · Catálogos simples de configuración

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-006-catalogos-simples` |
| **HU fuente** | `docs/hu/HU-006-catalogos-simples.md` |
| **Épica** | E1 — Catálogos maestros |
| **Prioridad** | Must |
| **Depende de** | HU-001 |
| **Capacidad** | `catalogos-simples` (ADDED) |

## Intención

Cuatro catálogos comparten exactamente el mismo comportamiento —coberturas, motivos de estado de
póliza, estados de siniestro y tipos de afiliación— y hoy viven como cuatro pantallas casi
idénticas con datos simulados. Especificarlos como una sola capacidad evita cuatro
implementaciones distintas y deja listas las opciones que después consumen los formularios de
póliza, anexo, siniestro y afiliación.

## Alcance

- Listado con buscador y creación mediante modal para los cuatro catálogos.
- Validación común: nombre obligatorio y único dentro de cada catálogo.
- Atributos propios: tres marcas en motivos (Cancelación, No renovación, Creación de anexo) y
  color en estados de siniestro.
- Inactivación en lugar de borrado cuando el elemento ya se usa.

## Fuera de alcance

- El consumo de estos catálogos en los formularios de póliza, anexo y siniestro: se especifica en
  HU-014, HU-027 y HU-030.
- Edición masiva, reordenamiento manual o jerarquías dentro de un catálogo.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Creación de un elemento del catálogo | Alta desde el modal con nombre válido |
| CA-2 | Nombre obligatorio y único | Nombre vacío o repetido en el mismo catálogo |
| CA-3 | Búsqueda | Texto sin distinguir mayúsculas ni acentos |
| CA-4 | Marcas del motivo de póliza | Motivo marcado como Cancelación |
| CA-5 | Color del estado de siniestro | Estado creado con color |
| CA-6 | Cancelación del modal | Cierre con "Cancelar" |

## Reglas para el `design.md`

- RN-1 — Nombre único dentro de cada catálogo, ignorando mayúsculas y espacios sobrantes.
- RN-2 — El color de un estado de siniestro es hexadecimal válido (`#RRGGBB`).
- RN-3 — Un elemento usado por un registro operativo se inactiva, no se elimina.
- Los cuatro catálogos comparten servicio y validaciones; sólo cambian los campos extra.

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET/POST | `/api/coberturas` | Nombre |
| GET/POST | `/api/motivos-poliza` | Nombre + `cancelacion`, `no_renovacion`, `anexo` |
| GET/POST | `/api/estados-siniestro` | Nombre + `color` |
| GET/POST | `/api/tipos-afiliacion` | Nombre |

## Reutilización visual

- Pantallas existentes: `config/CoberturasPage.tsx`, `MotivosPage.tsx`, `SiniestrosPage.tsx`,
  `AfiliacionPage.tsx`.
- Clases: `.toolbar` con buscador, `.tblwrap`, `.tbl`, `.modal`, `.modal-ov`, `.field`, `.inp`,
  `.btn.btn-pri`, `.b-dot` para la muestra de color.
- Componente `components/ui/Modal.tsx` ya existe: se usa tal cual.

## Verificación

- Unitarias **parametrizadas**: el mismo juego de validaciones corre para los cuatro catálogos.
- E2E `e2e/specs/hu-006-catalogos-simples.spec.ts`: crear y buscar en cada catálogo.

## Decisiones abiertas

1. **Un modelo o cuatro**: ¿una tabla genérica con discriminador o un modelo por catálogo? Los
   campos extra (marcas, color) y las relaciones futuras inclinan hacia modelos separados con una
   clase base abstracta; confirmarlo antes del `design.md`.
2. **Un motivo con varias marcas**: ¿puede un motivo ser Cancelación y No renovación a la vez? CA-4
   sugiere exclusividad; la HU no lo dice.
3. **Edición**: el prototipo sólo crea. ¿Se permite renombrar un elemento ya usado, o queda
   congelado para no alterar registros históricos?
