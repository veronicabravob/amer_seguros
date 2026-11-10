# HU-024 — Selección múltiple y acciones masivas

|  |  |
|---|---|
| **Épica** | E7 — Operación masiva y comunicaciones |
| **Prioridad** | Should |
| **Depende de** | HU-008, HU-012 |

## Historia

**Como** asesor comercial
**quiero** seleccionar varias pólizas o clientes y actuar sobre todos a la vez
**para** no repetir la misma gestión registro por registro.

## Contexto en el prototipo

En pólizas y en clientes: casilla en el encabezado y por fila; al haber selección aparece la barra
con el conteo y las acciones (pólizas: Renovar, Exportar, Enviar email, Limpiar; clientes: Enviar
email, Exportar, Segmentar, Limpiar).

## Criterios de aceptación

### CA-1 — Seleccionar y contar
**CUANDO** el usuario marca tres filas
**ENTONCES** la barra de acciones aparece indicando "3 seleccionadas" y el encabezado refleja el mismo número.

### CA-2 — Seleccionar todo lo filtrado
**CUANDO** marca la casilla del encabezado
**ENTONCES** quedan seleccionados todos los registros del filtro actual, no los de todas las páginas, y se indica cuántos son.

### CA-3 — Limpiar selección
**CUANDO** presiona "Limpiar"
**ENTONCES** la selección se vacía y la barra desaparece.

### CA-4 — Acción masiva con confirmación
**CUANDO** ejecuta una acción masiva
**ENTONCES** el sistema pide confirmación indicando cuántos registros se verán afectados.

### CA-5 — Resultado parcial
**CUANDO** la acción falla para algunos registros
**ENTONCES** el sistema informa cuántos se procesaron y cuántos no, con el motivo.

### CA-6 — La selección no navega
**CUANDO** hace clic en la casilla de una fila
**ENTONCES** no se abre el detalle del registro.

## Reglas de negocio

- RN-1 — La selección se pierde al cambiar de filtro o de página, y se avisa antes de perderla.
- RN-2 — Las acciones masivas respetan los permisos del rol.
- RN-3 — Toda acción masiva queda auditada como un lote.

## Datos y API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/polizas/acciones-masivas` | `{ids, accion}` con resultado por id |

## Hecho cuando

- [ ] Unitarias del manejo de selección y del resultado parcial.
- [ ] E2E `e2e/hu-024-acciones-masivas.spec.ts`: CA-1, CA-2, CA-3, CA-6.
