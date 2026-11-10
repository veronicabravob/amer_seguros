# Brief — HU-024 · Selección múltiple y acciones masivas

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-024-acciones-masivas` |
| **HU fuente** | `docs/hu/HU-024-acciones-masivas.md` |
| **Épica** | E8 — Operación masiva y comunicaciones |
| **Prioridad** | Should |
| **Depende de** | HU-008, HU-012 |
| **Capacidad** | `acciones-masivas` (ADDED) |

## Intención

Cuando vencen veinte pólizas el mismo mes, gestionarlas una por una es el cuello de botella de la
operación. El prototipo ya dibuja las casillas y la barra de acciones en pólizas y en clientes;
este cambio define qué significa seleccionar, qué pasa al cambiar de página o de filtro, y cómo se
informa un resultado parcial.

## Alcance

- Selección por fila y desde el encabezado, con conteo visible en la barra y en el encabezado.
- Selección de "todo lo filtrado", con indicación explícita de cuántos registros son.
- Limpieza de la selección y desaparición de la barra.
- Confirmación previa de toda acción masiva, indicando cuántos registros se afectan.
- Informe de resultado parcial con el motivo de los que fallaron.
- La casilla no navega al detalle.

## Fuera de alcance

- La exportación en sí: HU-025 (aquí se invoca como una acción más).
- El envío de correos masivos: HU-026.
- Renovación masiva real: se apoya en HU-016 por cada póliza; definir si entra (ver decisiones).
- "Segmentar" clientes: sin criterios en la HU.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Selección y conteo | Marcado de tres filas |
| CA-2 | Selección de todo lo filtrado | Casilla del encabezado |
| CA-3 | Limpieza de la selección | Acción "Limpiar" |
| CA-4 | Confirmación de la acción masiva | Ejecución de una acción sobre la selección |
| CA-5 | Resultado parcial | Fallo en algunos registros |
| CA-6 | La selección no navega | Clic sobre la casilla de una fila |

## Reglas para el `design.md`

- RN-1 — La selección se pierde al cambiar de filtro o de página, y se avisa antes de perderla.
- RN-2 — Las acciones masivas respetan los permisos del rol (HU-020).
- RN-3 — Toda acción masiva queda auditada como un lote (mismo registro de auditoría de HU-011).
- La operación es por lote en el backend: una sola petición, resultado por identificador.

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/polizas/acciones-masivas` | `{ids, accion}` con resultado por id |

## Reutilización visual

- Barras y casillas existentes en `polizas/PolizasListPage.tsx` y `clientes/ClientesListPage.tsx`.
- Clases: `.ck`, `.prow.sel`, la barra de acciones ya presente, `.btn.btn-sm`, `.btn-gh`,
  `components/ui/Modal.tsx` para la confirmación.
- `data-testid` en la casilla del encabezado, en el conteo de la barra y en cada acción.

## Verificación

- Unitarias del manejo de la selección (incluido "todo lo filtrado") y de la construcción del
  resultado parcial.
- E2E `e2e/specs/hu-024-acciones-masivas.spec.ts`: CA-1, CA-2, CA-3 y CA-6.

## Decisiones abiertas

1. **Qué acciones entran realmente**: el prototipo ofrece Renovar, Exportar, Enviar email y
   Segmentar, pero sólo Exportar tiene HU propia (HU-025). Recomendado: limitar este cambio a
   selección + exportación, y proponer las demás como HU nuevas.
2. **"Todo lo filtrado" (CA-2)**: ¿el backend recibe la lista de identificadores o el conjunto de
   filtros? Con miles de registros, enviar los filtros es lo único viable; cambia el contrato del
   endpoint.
3. **Límite por lote**: ¿cuántos registros como máximo por acción, y qué pasa por encima? Enlaza con
   la regla de 5 000 filas de HU-025 RN-2.
4. **Acciones masivas en clientes**: el endpoint propuesto es sólo de pólizas. Definir el equivalente
   o un endpoint genérico por módulo.
