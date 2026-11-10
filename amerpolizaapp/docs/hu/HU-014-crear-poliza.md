# HU-014 — Crear póliza (asistente de 4 pasos)

|  |  |
|---|---|
| **Épica** | E3 — Pólizas |
| **Prioridad** | Must |
| **Depende de** | HU-009, HU-004, HU-005, HU-017 |

## Historia

**Como** asesor comercial
**quiero** registrar una póliza guiado paso a paso
**para** no omitir datos obligatorios y que la liquidación quede correcta desde el inicio.

## Contexto en el prototipo

`polizas/PolizaCreatePage.tsx`: índice lateral con 4 pasos — 1) Identificación (tipo Individual /
Colectiva / Agrupadora, número, cliente, aseguradora, ramo), 2) Vigencia y riesgo (fechas, estado,
renovable, descripción del riesgo), 3) Prima y comisiones (prima neta, valor asegurado, % IVA,
% comisión y total estimado), 4) Vendedor y resumen (asesor, fecha de expedición y resumen).
Barra de progreso "Paso N de 4" y marca "Borrador guardado".

## Criterios de aceptación

### CA-1 — Avance secuencial
**CUANDO** el asesor completa los campos obligatorios del paso 1 y presiona "Siguiente sección"
**ENTONCES** avanza al paso 2, el índice marca el paso 1 como completado y la barra muestra "Paso 2 de 4".

### CA-2 — Bloqueo por campos obligatorios
**CUANDO** intenta avanzar sin número de póliza, cliente, aseguradora o ramo
**ENTONCES** el sistema no avanza y señala los campos faltantes.

### CA-3 — Campos según el tipo de póliza
**CUANDO** selecciona el tipo "Colectiva"
**ENTONCES** aparecen "Tipo de colectivo" y "Número de asegurados"; con "Agrupadora" aparecen "Criterio de agrupación" y "Nº de pólizas a agrupar"; con "Individual" aparece el campo "Riesgo".

### CA-4 — Vigencia coherente
**CUANDO** captura una fecha de fin anterior o igual a la de inicio
**ENTONCES** el sistema rechaza la fecha con "La fecha de fin debe ser posterior al inicio".

### CA-5 — Número de póliza único
**CUANDO** captura un número de póliza que ya existe para la misma aseguradora
**ENTONCES** el sistema lo rechaza al intentar guardar.

### CA-6 — Total estimado en vivo
**CUANDO** captura la prima neta en el paso 3
**ENTONCES** el total estimado con IVA se recalcula y se muestra formateado en pesos colombianos.

### CA-7 — Crear la póliza
**CUANDO** confirma en el paso 4
**ENTONCES** la póliza se crea en estado Vigente, aparece en el listado con la etiqueta NUEVA y el sistema navega a `/polizas`.

### CA-8 — Borrador
**CUANDO** abandona el asistente a medio camino
**ENTONCES** los datos capturados se conservan como borrador y puede retomarlos.

## Reglas de negocio

- RN-1 — El número de póliza es único por aseguradora.
- RN-2 — La vigencia mínima es de un día; la fecha de expedición no puede ser posterior al inicio.
- RN-3 — El cliente debe existir y estar activo; el asesor asignado debe ser un vendedor activo.
- RN-4 — Los porcentajes de IVA y comisión se proponen desde el ramo y la aseguradora, y pueden ajustarse.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/polizas` | Crear |
| POST | `/api/polizas/borrador` | Guardar borrador |
| GET | `/api/polizas/validar-numero?num=&aseguradora=` | Verificar unicidad |

## Hecho cuando

- [ ] Unitarias: validación de vigencia, unicidad de número, campos requeridos por tipo.
- [ ] E2E `e2e/hu-014-crear-poliza.spec.ts`: recorrido completo de los 4 pasos (CA-1 a CA-7) con video.
