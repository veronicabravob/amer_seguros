# Brief — HU-030 · Siniestros e historial de la póliza

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-030-siniestros-historial` |
| **HU fuente** | `docs/hu/HU-030-siniestros-historial.md` |
| **Épica** | E9 — Expediente de la póliza |
| **Prioridad** | Could |
| **Depende de** | HU-013, HU-006 |
| **Capacidad** | `siniestros` (ADDED) · `historial-poliza` (ADDED) |

## Intención

El siniestro es el momento en que el cliente mide si valió la pena contratar, y el historial es lo
que permite responder una auditoría sin reconstruir la verdad de memoria. Este cambio cierra el
expediente: registra reclamaciones con su estado y consolida en una sola línea de tiempo todo lo
que le pasó a la póliza desde que se emitió.

## Alcance

- Registro de siniestros con fecha de ocurrencia, descripción y valor reclamado, en estado inicial
  "Solicitado".
- Cambio de estado con autor y fecha, usando el catálogo con color de HU-006.
- Advertencia y confirmación explícita cuando la ocurrencia queda fuera de la vigencia.
- Historial consolidado en orden cronológico inverso: creación, anexos, renovaciones, cambios de
  estado, cargas de archivos y gestiones de cobro, cada uno con autor y fecha.
- Historial inalterable desde la interfaz.

## Fuera de alcance

- Flujo de reclamación con la aseguradora, adjuntos propios del siniestro o pagos de indemnización.
- Indicadores de siniestralidad en el tablero.
- Edición o borrado de entradas del historial (por definición, no existen).

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Registro de siniestro | Siniestro con fecha, descripción y valor reclamado |
| CA-2 | Cambio de estado | Estado nuevo con autor, fecha y color del catálogo |
| CA-3 | Ocurrencia fuera de la vigencia | Fecha fuera del periodo con confirmación explícita |
| CA-4 | Historial completo | Pestaña Historial con todos los tipos de evento |
| CA-5 | Historial inalterable | Consulta del historial por cualquier usuario |

## Reglas para el `design.md`

- RN-1 — Un siniestro pertenece a una sola póliza y conserva la trazabilidad de sus estados.
- RN-2 — El historial es de sólo escritura por el sistema (append-only): no hay endpoint de
  edición ni de borrado.
- RN-3 — Los estados disponibles provienen del catálogo de estados de siniestro (HU-006).
- El historial consume la misma fuente de eventos que la actividad del cliente (HU-010) y de la
  póliza (HU-013): una sola bitácora, varias vistas.

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET/POST | `/api/polizas/{id}/siniestros` | Listar y crear |
| PATCH | `/api/siniestros/{id}/estado` | Cambiar estado |
| GET | `/api/polizas/{id}/historial` | Historial completo |

## Reutilización visual

- Pestañas "Siniestros" e "Historial" ya existentes en `polizas/PolizaDetailPage.tsx`.
- Clases: `.tblwrap`, `.tbl` para siniestros, `.badge` con el color del catálogo, `.timeline` y
  `.tl-item` para el historial, `.empty`, `components/ui/Modal.tsx` para el alta y la confirmación.
- `data-testid` en el contador de la pestaña, en el selector de estado y en las entradas del
  historial.

## Verificación

- Unitarias: transición de estados, validación de la fecha de ocurrencia, inmutabilidad del
  historial, orden cronológico inverso.
- E2E `e2e/specs/hu-030-siniestros-historial.spec.ts`: registrar un siniestro, cambiar su estado y
  verificar el historial.
- Cierre de épica: regresión completa con evidencia, según `gate-de-entrega` nivel 3.

## Decisiones abiertas

1. **Transiciones permitidas entre estados**: el catálogo es configurable (Solicitado, En proceso,
   Objetado, Pagado), pero ¿cualquier estado puede seguir a cualquier otro? Si hay un flujo, hay que
   declararlo, y entonces el catálogo necesita orden.
2. **Fuente del historial**: ¿se construye consultando cada tabla o se escribe en una bitácora de
   eventos al ocurrir cada acción? Lo segundo es más fiel y es lo que permite el append-only real;
   decide el modelo de auditoría que arrastran HU-011, HU-020 y HU-024.
3. **Valor reclamado y valor indemnizado**: la HU sólo pide el reclamado. Confirmar que el pagado
   queda fuera de esta versión.
4. **Quién registra siniestros**: la HU dice el asesor; definir si Recepción o Cobros también, en la
   matriz de HU-020.
