# HU-008 — Listar y filtrar clientes

|  |  |
|---|---|
| **Épica** | E2 — Clientes |
| **Prioridad** | Must |
| **Depende de** | HU-002 |

## Historia

**Como** asesor comercial
**quiero** ver la lista de clientes con filtros por estado, tipo y ciudad
**para** encontrar rápidamente a quién debo contactar.

## Contexto en el prototipo

`clientes/ClientesListPage.tsx`: encabezado con conteo ("X de 358 clientes · N seleccionados"),
pestañas Clientes/Contactos, buscador propio ("Buscar nombre, documento, email…"), chips
Todos/Clientes/Prospectos/Inactivos con contador, selectores de tipo y ciudad, tabla con avatar
de iniciales, documento y tipo de documento, contacto (teléfono y correo), ciudad, número de
pólizas, estado y acciones de fila; paginación al pie.

## Criterios de aceptación

### CA-1 — Listado inicial
**CUANDO** el asesor abre `/clientes`
**ENTONCES** ve la tabla con los clientes de su agencia, el conteo total en el encabezado y la primera página de resultados.

### CA-2 — Filtro por estado
**CUANDO** selecciona el chip "Prospectos"
**ENTONCES** la tabla muestra sólo clientes en estado Prospecto y el conteo del encabezado se actualiza.

### CA-3 — Búsqueda por nombre, documento o correo
**CUANDO** escribe texto en el buscador
**ENTONCES** la tabla muestra sólo los clientes cuyo nombre, documento o correo contienen ese texto, sin distinguir mayúsculas.

### CA-4 — Combinación de filtros
**CUANDO** aplica el chip "Clientes" y además filtra por ciudad "Duitama"
**ENTONCES** la tabla muestra únicamente los que cumplen ambas condiciones.

### CA-5 — Sin resultados
**CUANDO** ningún cliente cumple los criterios
**ENTONCES** la tabla muestra un estado vacío con la acción "Limpiar filtros".

### CA-6 — Abrir el detalle
**CUANDO** hace clic en una fila o en el botón de ver
**ENTONCES** el sistema navega a `/clientes/{id}`.

### CA-7 — Distintivo por tipo
**CUANDO** el cliente es Persona, Empresa o Consorcio
**ENTONCES** la fila muestra la etiqueta de tipo correspondiente y el avatar con las iniciales del nombre.

## Reglas de negocio

- RN-1 — El conteo de pólizas por cliente se calcula desde las pólizas asociadas.
- RN-2 — La paginación es del lado del servidor, 25 registros por página.
- RN-3 — Un cliente Inactivo se muestra atenuado y no aparece en el selector de cliente al crear pólizas.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/clientes?q=&estado=&tipo=&ciudad=&page=` | Listado paginado con conteo de pólizas |

## Hecho cuando

- [ ] Unitarias del filtrado y del cálculo de iniciales.
- [ ] E2E `e2e/hu-008-listar-clientes.spec.ts`: CA-2, CA-3, CA-4, CA-5, CA-6.
