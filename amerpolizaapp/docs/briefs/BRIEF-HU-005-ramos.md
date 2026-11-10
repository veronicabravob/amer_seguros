# Brief — HU-005 · Gestionar ramos y subramos

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-005-ramos` |
| **HU fuente** | `docs/hu/HU-005-ramos.md` |
| **Épica** | E1 — Catálogos maestros |
| **Prioridad** | Must |
| **Depende de** | HU-004 |
| **Capacidad** | `ramos` (ADDED) |

## Intención

El ramo es lo que le dice al sistema qué comisión y qué impuestos aplican a una póliza. Hoy
`config/RamosListPage.tsx` y `config/RamoFormPage.tsx` muestran esa estructura con datos
simulados. Este cambio la vuelve real: ramo principal, subramo, comisión por aseguradora y las
dos marcas que afectan el cálculo (IVA sobre gastos de expedición y mapa de oportunidad).

## Alcance

- Alta, edición y búsqueda de ramos con su ramo principal y subramo.
- Asociación de varias aseguradoras al mismo ramo, cada una con su porcentaje de comisión.
- Indicador "+N" de aseguradoras adicionales en el listado.
- Marcas "Calcular IVA a gastos de expedición" y "Mostrar en mapa de oportunidad".
- Inactivación en lugar de borrado cuando hay pólizas asociadas.

## Fuera de alcance

- El cálculo en sí de prima, IVA y comisión: se especifica en HU-015; aquí sólo se **configura**.
- El mapa de oportunidad como pantalla: sólo se guarda la marca.
- Comisiones diferenciadas por año del vendedor: eso vive en HU-017.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Registro de ramo con subramo | Alta con ramo principal y subramo |
| CA-2 | Comisión por aseguradora | Dos aseguradoras con porcentajes distintos |
| CA-3 | Unicidad de la combinación | Ramo principal + subramo repetido |
| CA-4 | IVA sobre gastos de expedición | Marca activada y pólizas nuevas del ramo |
| CA-5 | Búsqueda del listado | Texto de nombre de ramo o de aseguradora |

## Reglas para el `design.md`

- RN-1 — Un ramo pertenece a una línea de negocio (ramo principal) y puede tener varias aseguradoras.
- RN-2 — La comisión por aseguradora es un porcentaje con dos decimales (`Decimal`).
- RN-3 — No se elimina un ramo con pólizas asociadas; sólo se inactiva.
- Ramos principales del prototipo: Autos/Vehículos, Cumplimiento, Responsabilidad Civil, Vida,
  Salud, Transporte, Todo Riesgo, Manejo.

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/ramos?q=&activo=` | Listado |
| POST | `/api/ramos` | Crear con `comisiones: [{aseguradora_id, pct}]` |
| GET/PUT | `/api/ramos/{id}` | Detalle y edición |

## Reutilización visual

- Listado: `.tblwrap`, `.tbl`, `.badge` para el "+N", `.toolbar` con buscador, `.pager`.
- Formulario: `.fgrid`, `.field`, `.field.full`, `.switch` para las dos marcas, `.form-foot`.
- La fila de comisión por aseguradora se arma con `.fgrid` y `.sel`; sin componentes nuevos.

## Verificación

- Unitarias: unicidad de ramo + subramo y resolución de la comisión aplicable por aseguradora
  (la función que después usa HU-015).
- E2E `e2e/specs/hu-005-ramos.spec.ts`: crear un ramo con dos aseguradoras y verificar el "+1".

## Decisiones abiertas

1. **Ramo principal**: ¿catálogo en base de datos o lista fija en código? Si es catálogo, ¿entra en
   HU-006 o se crea aquí?
2. **Comisión sin aseguradora asociada**: ¿se permite guardar un ramo sin ninguna aseguradora, o al
   menos una es obligatoria? Afecta a lo que ofrece el asistente de póliza.
3. **Base de la comisión**: la HU dice porcentaje, pero HU-015 menciona base "prima neta o agencia".
   Definir si esa base se configura en el ramo, en el vendedor (HU-017) o en ambos.
