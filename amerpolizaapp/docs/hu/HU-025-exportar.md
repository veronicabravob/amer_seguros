# HU-025 — Exportar listados

|  |  |
|---|---|
| **Épica** | E7 — Operación masiva y comunicaciones |
| **Prioridad** | Should |
| **Depende de** | HU-024 |

## Historia

**Como** asesor o administrador
**quiero** exportar a Excel lo que estoy viendo
**para** compartirlo o trabajarlo fuera del sistema.

## Criterios de aceptación

### CA-1 — Exportar el listado filtrado
**CUANDO** el usuario exporta con filtros activos
**ENTONCES** el archivo contiene exactamente los registros filtrados, con las mismas columnas visibles.

### CA-2 — Exportar la selección
**CUANDO** hay registros seleccionados y exporta
**ENTONCES** el archivo contiene sólo los seleccionados.

### CA-3 — Nombre del archivo
**CUANDO** se descarga el archivo
**ENTONCES** su nombre incluye el módulo y la fecha (por ejemplo `polizas-2026-09-11.xlsx`).

### CA-4 — Datos sensibles según rol
**CUANDO** exporta un usuario sin permiso sobre comisiones
**ENTONCES** el archivo no incluye columnas de comisión.

### CA-5 — Exportación vacía
**CUANDO** no hay registros que exportar
**ENTONCES** el sistema avisa y no genera archivo.

## Reglas de negocio

- RN-1 — Formatos soportados: XLSX y CSV con separador coma y codificación UTF-8.
- RN-2 — Exportaciones de más de 5 000 filas se generan en segundo plano y se notifican al terminar.
- RN-3 — Cada exportación queda auditada con usuario, filtros y número de registros.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/exportar/{modulo}` | Genera el archivo según filtros o ids |

## Hecho cuando

- [ ] Unitarias de la construcción de columnas por rol y del nombre del archivo.
- [ ] E2E `e2e/hu-025-exportar.spec.ts`: descarga verificada con `page.waitForEvent('download')`.
