# Brief — HU-017 · Gestionar vendedores

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-017-vendedores` |
| **HU fuente** | `docs/hu/HU-017-vendedores.md` |
| **Épica** | E6 — Vendedores y comisiones |
| **Prioridad** | Must |
| **Depende de** | HU-007 |
| **Capacidad** | `vendedores` (ADDED) |

## Intención

Lo que la agencia le paga a cada asesor o agencia asociada depende de un esquema con varias
variables: porcentaje, base de cálculo, retenciones y, a veces, un porcentaje distinto por año de
vigencia. `config/VendedoresListPage.tsx` y `config/VendedorFormPage.tsx` ya capturan ese esquema;
este cambio lo vuelve real y lo deja listo para la liquidación de HU-018.

## Alcance

- Alta, edición, listado y búsqueda de vendedores por nombre o documento.
- Datos principales, tipo de persona (Natural / Jurídica), documento, contacto y cuenta bancaria.
- Esquema de comisión: porcentaje, base de cálculo ("calcular comisión sobre"), IVA, retención,
  retención de ICA, marca "es agencia" y comisiones diferenciadas por año.
- Asignación a una sede.
- Validación del documento según el tipo de persona.

## Fuera de alcance

- El cálculo y la liquidación de comisiones: HU-018.
- El pago efectivo, la generación de cuentas de cobro o la contabilidad.
- El vínculo con la cuenta de usuario del asesor (ver decisiones abiertas).

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Registro de vendedor natural | Alta con documento, sede y porcentaje válidos |
| CA-2 | Documento único | Documento ya registrado |
| CA-3 | Vendedor persona jurídica | Tipo Jurídica valida NIT y habilita "Es agencia" |
| CA-4 | Base de cálculo de la comisión | Selección de "Prima neta" |
| CA-5 | Comisiones diferenciadas por año | Porcentaje distinto por año de vigencia |
| CA-6 | Búsqueda del listado | Texto de nombre o cédula |

## Reglas para el `design.md`

- RN-1 — Porcentaje de comisión y retenciones entre 0 y 100, con dos decimales (`Decimal`).
- RN-2 — Un vendedor inactivo no puede asignarse a pólizas nuevas (enlaza con HU-014 RN-3).
- RN-3 — Todo vendedor pertenece a una sede (HU-007).
- Bases de cálculo del prototipo: Prima neta, Agencia con deducciones, Agencia sin deducciones.

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET/POST | `/api/vendedores` | Listado y creación |
| GET/PUT | `/api/vendedores/{id}` | Detalle y edición |

## Reutilización visual

- Pantallas existentes `config/VendedoresListPage.tsx` y `config/VendedorFormPage.tsx`.
- Clases: `.toolbar`, `.tblwrap`, `.tbl`, `.badge`, `.fgrid`, `.field`, `.inp`, `.sel`, `.switch`,
  `.form-foot`.
- La tabla de porcentajes por año se arma con `.tbl` dentro del formulario; sin componentes nuevos.
- `data-testid` en el selector de base de cálculo, en la marca "es agencia" y en las filas por año.

## Verificación

- Unitarias: validación de documento según tipo de persona, rangos de porcentaje, selección del
  porcentaje correspondiente al año de vigencia (la función que consume HU-018).
- E2E `e2e/specs/hu-017-vendedores.spec.ts`: crear un vendedor y verificarlo en el listado.

## Decisiones abiertas

1. **Vendedor y usuario**: ¿un asesor comercial con cuenta (HU-019) es el mismo registro que un
   vendedor, o son entidades separadas enlazadas? Determina quién aparece en el paso 4 del
   asistente de póliza y cómo se filtra "mis pólizas" (HU-020 CA-2).
2. **"Año de vigencia" (CA-5)**: ¿el año de la póliza dentro de una cadena de renovaciones (primer
   año, segundo año…) o el año calendario? Cambia por completo la implementación y afecta a HU-016.
3. **Inactivación**: la HU menciona vendedores inactivos, pero el formulario no tiene la marca.
   Definir dónde se activa y desactiva.
4. **Precedencia de la base de cálculo** frente a la configuración del ramo (ver decisión abierta 1
   de HU-015): debe quedar una sola regla.
