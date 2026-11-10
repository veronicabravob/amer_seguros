# Brief — HU-004 · Gestionar aseguradoras

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-004-aseguradoras` |
| **HU fuente** | `docs/hu/HU-004-aseguradoras.md` |
| **Épica** | E1 — Catálogos maestros |
| **Prioridad** | Must |
| **Depende de** | HU-001 |
| **Capacidad** | `aseguradoras` (ADDED) |

## Intención

Las aseguradoras son la raíz de casi todo el dominio: sin ellas no hay ramos, ni pólizas, ni
liquidación de comisiones y retenciones. El prototipo ya tiene el listado y el formulario
(`config/AseguradorasListPage.tsx` y `config/AseguradoraFormPage.tsx`) con datos simulados; este
cambio los respalda con modelo, validaciones y API reales, incluidos los porcentajes tributarios
que después consume el cálculo de la póliza.

## Alcance

- Alta, consulta, edición y búsqueda de aseguradoras por nombre o NIT.
- Datos de identificación y contacto, y bloque de retenciones e impuestos
  (IVA, retención, retención de IVA, ICA), código de intermediario, cuenta bancaria y link de pago.
- Activar e inactivar, con la regla que protege las aseguradoras con pólizas vigentes.
- Conteo de ramos asociados en el listado.

## Fuera de alcance

- La configuración de comisión por ramo: se define en HU-005.
- El uso de los porcentajes en la liquidación: se especifica en HU-015.
- Carga masiva o sincronización con sistemas de la aseguradora.
- Eliminación física de aseguradoras.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Registro de una aseguradora | Alta con nombre y NIT válidos |
| CA-2 | Unicidad del NIT | NIT ya registrado en la agencia |
| CA-3 | Campos obligatorios | Guardado sin nombre o sin NIT |
| CA-4 | Rango de los porcentajes | Porcentaje fuera de 0–100 |
| CA-5 | Búsqueda en el listado | Texto parcial de nombre o NIT |
| CA-6 | Inactivación protegida | Aseguradora con pólizas vigentes |

## Reglas para el `design.md`

- RN-1 — NIT único por agencia, con formato `NNN.NNN.NNN-D`.
- RN-2 — Porcentajes con dos decimales, entre 0 y 100 (`Decimal`, nunca `float`).
- RN-3 — Una aseguradora inactiva no aparece en los selectores de creación de póliza, pero sí en
  el histórico.
- Toda consulta se filtra por la agencia del usuario autenticado.

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/aseguradoras?q=&activa=` | Listado con búsqueda |
| POST | `/api/aseguradoras` | Crear |
| GET/PUT | `/api/aseguradoras/{id}` | Detalle y edición |
| PATCH | `/api/aseguradoras/{id}/estado` | Activar / inactivar |

**Campos:** nombre, nit, email, telefono, direccion, codigo_intermediario, cuenta_bancaria,
link_pago, pct_iva, pct_retencion, pct_retencion_iva, pct_retencion_ica, activa.

## Reutilización visual

- Listado: `.toolbar`, `.chips` (Activas/Inactivas), `.tblwrap`, `.tbl`, `.rowact`, `.pager`.
- Formulario: `.form-h`, `.form-hd`, `.fgrid`, `.field`, `.lbl`, `.req`, `.inp`, `.hint`,
  `.form-foot`, `.btn.btn-pri`.
- Mensajes de validación por campo con `.hint` en estado de error; nada de alertas nuevas.

## Verificación

- Unitarias: formato y unicidad del NIT, rangos de porcentaje, regla de inactivación.
- E2E `e2e/specs/hu-004-aseguradoras.spec.ts`: crear, buscar y error de NIT duplicado.
- Primera pantalla conectada al API según el paso 8.3 de la guía: sirve de patrón para el resto.

## Decisiones abiertas

1. **Validación del NIT**: ¿se verifica el dígito de verificación o sólo el formato? La HU pide
   formato; calcularlo evita datos erróneos pero agrega una regla que hay que probar.
2. **Normalización al guardar**: ¿se almacena el NIT con puntos y guion o sólo dígitos? Afecta a la
   unicidad ("900.123.456-7" y "9001234567" no deben convivir).
3. **Semilla**: qué aseguradoras del prototipo (`app/src/data/mockData.ts`) entran en `seed` y con
   qué porcentajes por defecto.
