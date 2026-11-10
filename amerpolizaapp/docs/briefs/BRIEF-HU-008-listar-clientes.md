# Brief — HU-008 · Listar y filtrar clientes

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-008-listar-clientes` |
| **HU fuente** | `docs/hu/HU-008-listar-clientes.md` |
| **Épica** | E3 — Clientes |
| **Prioridad** | Must |
| **Depende de** | HU-002 |
| **Capacidad** | `clientes` (ADDED: consulta) |

## Intención

El listado de clientes es la puerta de entrada al trabajo diario del asesor y el prerrequisito de
la emisión de pólizas. `clientes/ClientesListPage.tsx` ya tiene la tabla completa con chips,
filtros y paginación sobre datos simulados; este cambio crea la entidad cliente y sirve el listado
desde el API con filtrado y paginación del lado del servidor.

## Alcance

- Modelo de cliente con tipo (Persona, Empresa, Consorcio), documento, contacto, ciudad y estado.
- Listado paginado con conteo total en el encabezado.
- Chips por estado (Todos, Clientes, Prospectos, Inactivos) con contador.
- Búsqueda por nombre, documento o correo, y filtros por tipo y ciudad, combinables.
- Conteo de pólizas por cliente y navegación al detalle.
- Estado vacío con la acción "Limpiar filtros".

## Fuera de alcance

- Crear, editar o ver el detalle del cliente: HU-009, HU-010 y HU-011.
- La pestaña "Contactos" del prototipo: no tiene criterios de aceptación en la HU.
- Acciones masivas sobre la selección: HU-024.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Listado inicial de clientes | Apertura de `/clientes` |
| CA-2 | Filtro por estado | Chip "Prospectos" |
| CA-3 | Búsqueda por nombre, documento o correo | Texto parcial sin distinguir mayúsculas |
| CA-4 | Combinación de filtros | Chip "Clientes" más ciudad "Duitama" |
| CA-5 | Resultado vacío | Ningún cliente cumple los criterios |
| CA-6 | Apertura del detalle | Clic en la fila o en el botón de ver |
| CA-7 | Distintivo por tipo | Persona, Empresa y Consorcio con su etiqueta y avatar |

## Reglas para el `design.md`

- RN-1 — El conteo de pólizas por cliente se calcula desde las pólizas asociadas (sin `N+1`).
- RN-2 — Paginación del lado del servidor, 25 registros por página.
- RN-3 — Un cliente Inactivo se muestra atenuado y no aparece en el selector de nuevas pólizas.
- Todas las consultas se filtran por la agencia del usuario autenticado, y el alcance por rol sigue
  la matriz de HU-020.

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/clientes?q=&estado=&tipo=&ciudad=&page=` | Listado paginado con conteo de pólizas |

## Reutilización visual

- Pantalla existente `clientes/ClientesListPage.tsx`.
- Clases: `.toolbar`, `.chips`, `.chip.on`, `.chip-ct`, `.sel`, `.tblwrap`, `.tbl`, `.prow`,
  `.cav` (avatar de iniciales), `.badge` de estado, `.rowact`, `.pager`, `.empty`.
- `data-testid` en cada chip, en el buscador, en el conteo del encabezado y en las filas.

## Verificación

- Unitarias del filtrado combinado y del cálculo de iniciales del avatar.
- E2E `e2e/specs/hu-008-listar-clientes.spec.ts`: CA-2, CA-3, CA-4, CA-5 y CA-6.

## Decisiones abiertas

1. **Conteo de los chips**: ¿los contadores reflejan el total por estado o el total dentro de los
   filtros ya aplicados? En el prototipo son totales; conviene fijarlo en la spec.
2. **Ciudad**: ¿catálogo de ciudades o texto libre? El selector del prototipo sugiere catálogo;
   afecta al filtro y a la calidad de los datos.
3. **Origen del conteo "358 clientes"** del encabezado: total de la agencia o total filtrado. CA-1 y
   RN-4 de otras HU usan "X de Y"; definir la convención una sola vez para clientes y pólizas.
