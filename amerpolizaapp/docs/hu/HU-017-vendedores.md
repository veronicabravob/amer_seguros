# HU-017 — Gestionar vendedores

|  |  |
|---|---|
| **Épica** | E4 — Vendedores y comisiones |
| **Prioridad** | Must |
| **Depende de** | HU-007 |

## Historia

**Como** administrador
**quiero** registrar los vendedores con su esquema de comisiones y retenciones
**para** liquidar correctamente lo que se le paga a cada asesor o agencia.

## Contexto en el prototipo

`config/VendedoresListPage.tsx` (buscador por nombre o cédula, columnas nombre, cédula, % comisión,
"calcular sobre", % retención, tipo de persona, es agencia, sede) y `config/VendedorFormPage.tsx`
(datos principales, tipo de persona Natural/Jurídica, tipo y número de documento, contacto, cuenta
bancaria, esquema: % comisión, calcular comisión sobre — Prima neta / Agencia con o sin deducciones —,
% IVA, % retención, % retención ICA, "es agencia" y "comisiones diferentes por año").

## Criterios de aceptación

### CA-1 — Crear vendedor natural
**CUANDO** el administrador guarda un vendedor con nombre, documento, sede y % de comisión válidos
**ENTONCES** aparece en el listado con su esquema de comisión.

### CA-2 — Documento único
**CUANDO** captura un documento ya registrado
**ENTONCES** el sistema rechaza el guardado.

### CA-3 — Persona jurídica es agencia
**CUANDO** el tipo de persona es Jurídica
**ENTONCES** el documento se valida como NIT y la marca "Es agencia" queda disponible.

### CA-4 — Base de cálculo de la comisión
**CUANDO** elige "calcular comisión sobre: Prima neta"
**ENTONCES** las pólizas asignadas a ese vendedor liquidan la comisión sobre la prima neta y no sobre la comisión de agencia.

### CA-5 — Comisiones diferenciadas por año
**CUANDO** activa "comisiones diferentes por año"
**ENTONCES** puede definir un porcentaje distinto por año de vigencia, y la liquidación usa el del año correspondiente.

### CA-6 — Búsqueda
**CUANDO** busca por nombre o cédula
**ENTONCES** el listado se filtra por ambos campos.

## Reglas de negocio

- RN-1 — % de comisión y retenciones entre 0 y 100, con dos decimales.
- RN-2 — Un vendedor inactivo no puede asignarse a pólizas nuevas.
- RN-3 — Todo vendedor pertenece a una sede.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET/POST | `/api/vendedores` | Listado y creación |
| GET/PUT | `/api/vendedores/{id}` | Detalle y edición |

## Hecho cuando

- [ ] Unitarias: validación de documento por tipo de persona, rangos, selección de porcentaje por año.
- [ ] E2E `e2e/hu-017-vendedores.spec.ts`: crear vendedor y verificarlo en el listado.
