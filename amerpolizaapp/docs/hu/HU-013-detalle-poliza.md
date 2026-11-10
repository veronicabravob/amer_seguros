# HU-013 — Ver detalle de póliza

|  |  |
|---|---|
| **Épica** | E3 — Pólizas |
| **Prioridad** | Must |
| **Depende de** | HU-012 |

## Historia

**Como** asesor comercial
**quiero** abrir una póliza y ver su información completa organizada por pestañas
**para** responder cualquier consulta del cliente sobre su cobertura y sus valores.

## Contexto en el prototipo

`polizas/PolizaDetailPage.tsx`: encabezado con número, estado, barra de vigencia y acciones
(Editar, Renovar, Descargar); pestañas Resumen, Tomador y asegurado, Anexos, Archivos,
Bitácora de cobro, Historial, Siniestros y Actividad. La pestaña Resumen muestra los datos de
la póliza y una tarjeta lateral con prima anual, prima neta, gastos, IVA, comisión, valor
asegurado y total a pagar.

## Criterios de aceptación

### CA-1 — Resumen de la póliza
**CUANDO** el asesor abre `/polizas/{id}`
**ENTONCES** ve cliente, documento, aseguradora, ramo, riesgo, fechas de expedición, inicio y fin, si es renovable, forma de pago y asesor asignado.

### CA-2 — Valores liquidados
**CUANDO** consulta la tarjeta lateral
**ENTONCES** ve prima anual, prima neta, gastos, IVA, comisión, valor asegurado y total a pagar, coherentes entre sí (ver HU-015).

### CA-3 — Tomador y asegurado
**CUANDO** abre la pestaña "Tomador y asegurado"
**ENTONCES** ve nombre y documento de ambos, la relación entre ellos y los datos del beneficiario oneroso cuando aplica.

### CA-4 — Beneficiario oneroso no aplica
**CUANDO** el ramo no exige beneficiario oneroso
**ENTONCES** el bloque muestra "No aplica" en lugar de datos vacíos.

### CA-5 — Navegación entre pestañas
**CUANDO** cambia de pestaña
**ENTONCES** el contenido cambia sin recargar la página y la pestaña activa queda marcada.

### CA-6 — Volver al listado
**CUANDO** presiona "Volver al listado"
**ENTONCES** regresa a `/polizas` conservando los filtros que tenía.

### CA-7 — Póliza inexistente
**CUANDO** abre un id que no existe
**ENTONCES** ve "Póliza no encontrada" con enlace al listado.

## Reglas de negocio

- RN-1 — La fecha de expedición por defecto es 8 días antes del inicio de vigencia.
- RN-2 — El detalle es de sólo lectura; los cambios se hacen desde Editar o Renovar.
- RN-3 — Los contadores de las pestañas (anexos, archivos, siniestros) muestran el número real de registros.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/polizas/{id}` | Detalle con liquidación |
| GET | `/api/polizas/{id}/actividad` | Eventos de la póliza |

## Hecho cuando

- [ ] Unitarias del armado del detalle y de la regla de beneficiario oneroso.
- [ ] E2E `e2e/hu-013-detalle-poliza.spec.ts`: CA-1, CA-3, CA-5, CA-6, CA-7.
