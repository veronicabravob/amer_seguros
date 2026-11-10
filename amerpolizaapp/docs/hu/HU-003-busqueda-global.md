# HU-003 — Búsqueda global

|  |  |
|---|---|
| **Épica** | E0 — Fundación técnica y acceso |
| **Prioridad** | Should |
| **Depende de** | HU-002, HU-012 |

## Historia

**Como** asesor
**quiero** buscar desde la barra superior por número de póliza, cliente o documento
**para** llegar al registro sin navegar por los listados.

## Contexto en el prototipo

`Topbar.tsx` tiene el campo "Buscar póliza, cliente, documento…" conectado a `SearchContext`.
Hoy sólo filtra el listado de pólizas (`PolizasListPage`), por coincidencia en número, nombre
de cliente, documento o aseguradora.

## Criterios de aceptación

### CA-1 — Coincidencia por número de póliza
**CUANDO** el usuario escribe "994-0024" en la búsqueda global estando en el listado de pólizas
**ENTONCES** el listado muestra únicamente las pólizas cuyo número contiene ese texto.

### CA-2 — Coincidencia por cliente o documento
**CUANDO** el usuario escribe parte del nombre del cliente o de su documento
**ENTONCES** el listado muestra las pólizas de ese cliente.

### CA-3 — Búsqueda sin resultados
**CUANDO** ningún registro coincide
**ENTONCES** el listado muestra un estado vacío con el texto buscado y una acción para limpiar la búsqueda.

### CA-4 — Insensible a mayúsculas y acentos
**CUANDO** el usuario escribe "andina" o "ANDINA"
**ENTONCES** obtiene los mismos resultados que con la escritura exacta del nombre.

### CA-5 — La búsqueda no altera los filtros
**CUANDO** hay un filtro de estado activo y el usuario escribe en la búsqueda
**ENTONCES** ambos criterios se aplican juntos (intersección), y el contador del encabezado refleja el total filtrado.

## Reglas de negocio

- RN-1 — La búsqueda se ejecuta con al menos 2 caracteres y con retardo de 300 ms.
- RN-2 — Se buscan: número de póliza, nombre de cliente, documento y aseguradora.
- RN-3 — El texto buscado se conserva al cambiar de vista tabla/tarjetas.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/polizas?q=<texto>` | Búsqueda con paginación del lado del servidor |

## Hecho cuando

- [ ] Unitarias de normalización (minúsculas, acentos) y del predicado de coincidencia.
- [ ] E2E `e2e/hu-003-busqueda-global.spec.ts`: CA-1 a CA-5.
