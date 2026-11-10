# HU-009 — Crear cliente

|  |  |
|---|---|
| **Épica** | E2 — Clientes |
| **Prioridad** | Must |
| **Depende de** | HU-008 |

## Historia

**Como** asesor comercial
**quiero** registrar un cliente persona, empresa o consorcio con sus datos de contacto y perfil comercial
**para** poder emitirle pólizas y gestionar su relación.

## Contexto en el prototipo

Desde `ClientesListPage` el botón "Crear cliente" abre un modal con tres tipos (Persona con cédula,
Empresa con NIT, Consorcio/unión temporal) y navega a `/clientes/nuevo?tipo=<tipo>`.
`ClienteFormPage.tsx` agrupa: **Datos principales** (identificación, tipo de documento, número,
nombres, apellidos, fecha de nacimiento, género, estado civil), **Datos de contacto** (correo,
teléfono, dirección, país, departamento, ciudad), **Perfil comercial y patrimonial** (categoría,
referido, ingreso mensual, patrimonio, casa propia, observaciones) y **Notificaciones**
(correos automáticos: póliza por vencer, cobros por vencer, aviso de cancelación, autorización de
tratamiento de datos). Acciones: Cancelar y Guardar borrador.

## Criterios de aceptación

### CA-1 — Elegir el tipo de cliente
**CUANDO** el asesor elige "Cliente empresa" en el modal
**ENTONCES** el formulario se abre con tipo de documento NIT y con los campos de persona natural ocultos.

### CA-2 — Crear persona natural
**CUANDO** completa cédula, nombres, apellidos y teléfono y guarda
**ENTONCES** el cliente queda registrado en estado Prospecto y el sistema regresa al listado mostrándolo en la primera posición del filtro Prospectos.

### CA-3 — Documento obligatorio y único
**CUANDO** guarda sin número de documento, o con uno ya registrado en la agencia
**ENTONCES** el sistema no crea el cliente y señala el campo con el mensaje correspondiente.

### CA-4 — Correo válido
**CUANDO** captura un correo con formato inválido
**ENTONCES** el sistema marca el campo y no envía el formulario.

### CA-5 — Autorización de datos
**CUANDO** activa "Autoriza tratamiento de datos"
**ENTONCES** el sistema guarda la marca con la fecha y el usuario que la registró.

### CA-6 — Guardar borrador
**CUANDO** guarda como borrador con los campos mínimos incompletos
**ENTONCES** el registro se conserva como borrador, no aparece en el listado de clientes activos y puede retomarse después.

### CA-7 — Cancelar
**CUANDO** presiona "Cancelar" con cambios sin guardar
**ENTONCES** el sistema pide confirmación antes de descartar.

## Reglas de negocio

- RN-1 — El documento es único por agencia; tipo de documento válido: C.C., C.E., NIT, Pasaporte.
- RN-2 — Un cliente nace como Prospecto y pasa a Cliente cuando tiene su primera póliza vigente.
- RN-3 — Sin autorización de tratamiento de datos no se pueden enviar notificaciones automáticas (ver HU-026).
- RN-4 — Ingreso mensual y patrimonio son numéricos no negativos.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/clientes` | Crear (`estado=Prospecto` por defecto) |
| GET | `/api/clientes/validar-documento?doc=` | Verificar unicidad |

## Hecho cuando

- [ ] Unitarias: unicidad de documento, validación de correo, transición Prospecto→Cliente.
- [ ] E2E `e2e/hu-009-crear-cliente.spec.ts`: CA-1, CA-2, CA-3, CA-7.
