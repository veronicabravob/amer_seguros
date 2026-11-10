# Brief — HU-009 · Crear cliente

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-009-crear-cliente` |
| **HU fuente** | `docs/hu/HU-009-crear-cliente.md` |
| **Épica** | E3 — Clientes |
| **Prioridad** | Must |
| **Depende de** | HU-008 |
| **Capacidad** | `clientes` (MODIFIED: alta) |

## Intención

Sin alta de clientes no hay emisión de pólizas. El prototipo ya tiene el modal de tipo de cliente
y el formulario por bloques (`ClienteFormPage.tsx`); este cambio define qué es obligatorio, qué se
valida, cómo nace el estado del cliente y cómo se registra la autorización de tratamiento de datos,
que después condiciona las notificaciones automáticas.

## Alcance

- Modal de elección de tipo: Persona (cédula), Empresa (NIT), Consorcio/unión temporal.
- Formulario con los cuatro bloques: datos principales, contacto, perfil comercial y patrimonial,
  y preferencias de notificación.
- Validaciones: documento obligatorio y único, correo con formato válido, valores numéricos no
  negativos.
- Estado inicial Prospecto y registro de la autorización de datos con fecha y usuario.
- Guardado como borrador y confirmación al cancelar con cambios pendientes.

## Fuera de alcance

- El envío de notificaciones: aquí sólo se guardan las preferencias (HU-026).
- Edición posterior y cambio de estado: HU-011.
- Carga masiva de clientes o importación desde archivo.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Elección del tipo de cliente | Selección de "Cliente empresa" |
| CA-2 | Alta de persona natural | Datos mínimos completos y retorno al listado |
| CA-3 | Documento obligatorio y único | Documento vacío o ya registrado |
| CA-4 | Correo válido | Formato de correo inválido |
| CA-5 | Autorización de tratamiento de datos | Marca activada con fecha y usuario |
| CA-6 | Guardado como borrador | Campos mínimos incompletos |
| CA-7 | Cancelación con cambios | Confirmación antes de descartar |

## Reglas para el `design.md`

- RN-1 — Documento único por agencia; tipos válidos: C.C., C.E., NIT, Pasaporte.
- RN-2 — Un cliente nace Prospecto y pasa a Cliente con su primera póliza vigente.
- RN-3 — Sin autorización de tratamiento de datos no se envían notificaciones automáticas (HU-026,
  Ley 1581 de 2012).
- RN-4 — Ingreso mensual y patrimonio son numéricos no negativos (`Decimal`).
- Los campos de persona natural se ocultan para Empresa y Consorcio, no sólo se deshabilitan.

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/clientes` | Crear (`estado=Prospecto` por defecto) |
| GET | `/api/clientes/validar-documento?doc=` | Verificar unicidad |

## Reutilización visual

- Pantallas existentes: modal de tipo en `ClientesListPage.tsx` y `clientes/ClienteFormPage.tsx`.
- Clases: `.modal`, `.modal-ov`, `.form-h`, `.form-hd`, `.fgrid`, `.field`, `.field.full`, `.lbl`,
  `.req`, `.inp`, `.hint`, `.switch` para las preferencias, `.form-foot`.
- `data-testid` en cada opción del modal, en los campos obligatorios y en los mensajes de error.

## Verificación

- Unitarias: unicidad de documento, validación de correo, transición Prospecto → Cliente, campos
  requeridos según el tipo.
- E2E `e2e/specs/hu-009-crear-cliente.spec.ts`: CA-1, CA-2, CA-3 y CA-7.

## Decisiones abiertas

1. **Borrador (CA-6)**: ¿se guarda como un cliente con estado `Borrador` o en una tabla aparte? Debe
   quedar claro que no aparece en el listado ni en los selectores.
2. **Campos mínimos**: la HU pide cédula, nombres, apellidos y teléfono para persona natural.
   Definir el mínimo equivalente para Empresa y Consorcio (razón social, NIT, ¿representante?).
3. **Transición automática a Cliente**: ¿ocurre al emitir la póliza (HU-014) o en un proceso? Debe
   especificarse en un solo lugar para no duplicar la regla.
4. **Validación en vivo del documento**: el endpoint `validar-documento` sugiere comprobación
   mientras se escribe; confirmar para no dejar sólo el error al guardar.
