# HU-006 — Catálogos simples de configuración

|  |  |
|---|---|
| **Épica** | E1 — Catálogos maestros |
| **Prioridad** | Must |
| **Depende de** | HU-001 |

Cubre cuatro catálogos que comparten el mismo comportamiento: **coberturas**,
**motivos de estado de póliza**, **estados de siniestro** y **tipos de afiliación**.

## Historia

**Como** administrador
**quiero** mantener los catálogos simples del sistema
**para** que los formularios de póliza, siniestro y afiliación ofrezcan siempre las opciones vigentes.

## Contexto en el prototipo

`config/CoberturasPage.tsx`, `config/MotivosPage.tsx`, `config/SiniestrosPage.tsx` y
`config/AfiliacionPage.tsx`: listado con buscador, botón "Crear" y modal con el campo Nombre.
Motivos añade tres marcas (Cancelación, No renovación, Creación de anexo) y estados de
siniestro añade un color.

## Criterios de aceptación

### CA-1 — Crear un elemento del catálogo
**CUANDO** el administrador abre el modal, escribe un nombre y confirma
**ENTONCES** el elemento aparece en el listado con la fecha de creación del día y el modal se cierra.

### CA-2 — Nombre obligatorio y único
**CUANDO** confirma con el nombre vacío o repetido dentro del mismo catálogo
**ENTONCES** el sistema no crea el elemento y muestra el mensaje de validación correspondiente.

### CA-3 — Buscar
**CUANDO** escribe en el buscador del catálogo
**ENTONCES** el listado muestra sólo los elementos cuyo nombre contiene ese texto, sin distinguir mayúsculas ni acentos.

### CA-4 — Marcas del motivo de póliza
**CUANDO** crea un motivo marcado como "Cancelación"
**ENTONCES** ese motivo queda disponible únicamente en la acción de cancelar póliza, y no en la de crear anexo.

### CA-5 — Color del estado de siniestro
**CUANDO** crea un estado de siniestro con un color
**ENTONCES** el listado muestra la muestra de color y ese color se usa en la etiqueta del siniestro.

### CA-6 — Cancelar sin guardar
**CUANDO** cierra el modal con "Cancelar"
**ENTONCES** no se crea nada y el listado queda igual.

## Reglas de negocio

- RN-1 — Nombre único dentro de cada catálogo, ignorando mayúsculas y espacios sobrantes.
- RN-2 — El color de un estado de siniestro es un hexadecimal válido (`#RRGGBB`).
- RN-3 — Un elemento usado por un registro operativo se inactiva, no se elimina.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET/POST | `/api/coberturas` | Nombre |
| GET/POST | `/api/motivos-poliza` | Nombre + `cancelacion`, `no_renovacion`, `anexo` |
| GET/POST | `/api/estados-siniestro` | Nombre + `color` |
| GET/POST | `/api/tipos-afiliacion` | Nombre |

## Hecho cuando

- [ ] Unitarias parametrizadas: el mismo juego de validaciones corre para los cuatro catálogos.
- [ ] E2E `e2e/hu-006-catalogos-simples.spec.ts`: crear y buscar en cada catálogo.
