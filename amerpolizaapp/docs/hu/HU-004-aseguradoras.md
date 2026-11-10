# HU-004 — Gestionar aseguradoras

|  |  |
|---|---|
| **Épica** | E1 — Catálogos maestros |
| **Prioridad** | Must |
| **Depende de** | HU-001 |

## Historia

**Como** administrador de la agencia
**quiero** registrar y consultar las aseguradoras con las que trabajamos
**para** poder asociarlas a ramos, pólizas y liquidaciones.

## Contexto en el prototipo

`config/AseguradorasListPage.tsx` (listado con búsqueda por nombre o NIT, pestañas Activas/Inactivas)
y `config/AseguradoraFormPage.tsx` (formulario en dos bloques: identificación y contacto;
retenciones e impuestos con % IVA, % Retención, % Retención IVA, % Retención ICA, código de
intermediario, cuenta bancaria y link de pago).

## Criterios de aceptación

### CA-1 — Crear aseguradora
**CUANDO** el administrador guarda el formulario con nombre y NIT válidos
**ENTONCES** la aseguradora queda registrada como activa y aparece en el listado con su conteo de ramos en cero.

### CA-2 — NIT único
**CUANDO** intenta guardar una aseguradora con un NIT ya registrado
**ENTONCES** el sistema rechaza el guardado y señala el campo NIT con "Ya existe una aseguradora con este NIT".

### CA-3 — Campos obligatorios
**CUANDO** intenta guardar sin nombre o sin NIT
**ENTONCES** el sistema marca los campos obligatorios y no envía la petición.

### CA-4 — Porcentajes válidos
**CUANDO** captura un porcentaje fuera del rango 0–100
**ENTONCES** el sistema rechaza el valor con "El porcentaje debe estar entre 0 y 100".

### CA-5 — Buscar en el listado
**CUANDO** escribe parte del nombre o del NIT en el buscador del listado
**ENTONCES** la tabla muestra sólo las aseguradoras que coinciden.

### CA-6 — Inactivar
**CUANDO** inactiva una aseguradora que tiene pólizas vigentes
**ENTONCES** el sistema lo impide e informa cuántas pólizas vigentes la referencian.

## Reglas de negocio

- RN-1 — NIT único por agencia, con formato `NNN.NNN.NNN-D`.
- RN-2 — Porcentajes con dos decimales, entre 0 y 100.
- RN-3 — Una aseguradora inactiva no aparece en los selectores de creación de póliza, pero sí en el histórico.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/aseguradoras?q=&activa=` | Listado con búsqueda |
| POST | `/api/aseguradoras` | Crear |
| GET/PUT | `/api/aseguradoras/{id}` | Detalle y edición |
| PATCH | `/api/aseguradoras/{id}/estado` | Activar / inactivar |

**Campos:** nombre, nit, email, telefono, direccion, codigo_intermediario, cuenta_bancaria,
link_pago, pct_iva, pct_retencion, pct_retencion_iva, pct_retencion_ica, activa.

## Hecho cuando

- [ ] Unitarias: validación de NIT, unicidad, rangos de porcentaje, regla de inactivación.
- [ ] E2E `e2e/hu-004-aseguradoras.spec.ts`: crear, buscar, error de duplicado.
