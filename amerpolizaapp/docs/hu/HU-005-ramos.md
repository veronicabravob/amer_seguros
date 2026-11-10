# HU-005 — Gestionar ramos y subramos

|  |  |
|---|---|
| **Épica** | E1 — Catálogos maestros |
| **Prioridad** | Must |
| **Depende de** | HU-004 |

## Historia

**Como** administrador
**quiero** definir los ramos y subramos con su esquema de comisión por aseguradora
**para** que al crear una póliza el sistema sepa qué comisión y qué impuestos aplican.

## Contexto en el prototipo

`config/RamosListPage.tsx` lista nombre, aseguradora, "+N" aseguradoras adicionales, IVA y fecha.
`config/RamoFormPage.tsx` captura ramo principal (Autos/Vehículos, Cumplimiento, Responsabilidad
Civil, Vida, Salud, Transporte, Todo Riesgo, Manejo), subramo, "Calcular IVA a gastos de expedición",
"Mostrar en mapa de oportunidad" y comisiones por aseguradora.

## Criterios de aceptación

### CA-1 — Crear ramo con subramo
**CUANDO** el administrador selecciona un ramo principal, escribe un subramo y guarda
**ENTONCES** el ramo aparece en el listado con la fecha de creación del día.

### CA-2 — Comisión por aseguradora
**CUANDO** asocia dos aseguradoras al mismo ramo con porcentajes de comisión distintos
**ENTONCES** el listado muestra la aseguradora principal y el indicador "+1", y cada porcentaje queda disponible para el cálculo de la póliza.

### CA-3 — Combinación única
**CUANDO** intenta crear un ramo con la misma combinación ramo principal + subramo
**ENTONCES** el sistema rechaza el guardado indicando que ya existe.

### CA-4 — IVA sobre gastos
**CUANDO** activa "Calcular IVA a gastos de expedición"
**ENTONCES** las pólizas nuevas de ese ramo incluyen el IVA sobre los gastos en su liquidación.

### CA-5 — Búsqueda
**CUANDO** busca por nombre de ramo o de aseguradora
**ENTONCES** el listado se filtra por cualquiera de los dos campos.

## Reglas de negocio

- RN-1 — Un ramo pertenece a una línea de negocio (ramo principal) y puede tener varias aseguradoras.
- RN-2 — La comisión por aseguradora se expresa en porcentaje con dos decimales.
- RN-3 — No se puede eliminar un ramo con pólizas asociadas; sólo inactivarlo.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/ramos?q=&activo=` | Listado |
| POST | `/api/ramos` | Crear con `comisiones: [{aseguradora_id, pct}]` |
| GET/PUT | `/api/ramos/{id}` | Detalle y edición |

## Hecho cuando

- [ ] Unitarias: unicidad ramo+subramo, resolución de la comisión aplicable por aseguradora.
- [ ] E2E `e2e/hu-005-ramos.spec.ts`: crear ramo con dos aseguradoras y verificar "+1" en el listado.
