# Brief — HU-027 · Anexos de póliza

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-027-anexos` |
| **HU fuente** | `docs/hu/HU-027-anexos.md` |
| **Épica** | E9 — Expediente de la póliza |
| **Prioridad** | Should |
| **Depende de** | HU-013, HU-006 |
| **Capacidad** | `anexos-poliza` (ADDED) · `liquidacion-polizas` (MODIFIED: recálculo por anexo) |

## Intención

Una póliza vigente cambia: sube el valor asegurado, se prorroga la vigencia, se incluye un
vehículo. Hoy esos cambios se registran por fuera y la póliza deja de reflejar la realidad. El
anexo es la forma correcta de modificarla dejando constancia y conservando el histórico.

## Alcance

- Alta de anexos sobre una póliza vigente, con motivo, fecha y descripción.
- Selector de motivo limitado a los marcados como "Creación de anexo" (HU-006).
- Numeración consecutiva por póliza y contador en la pestaña.
- Anexos que modifican prima o valor asegurado: actualización de la póliza conservando los valores
  anteriores en el historial y nueva liquidación.
- Validación de la fecha dentro de la vigencia y del estado de la póliza.

## Fuera de alcance

- Anular o revertir un anexo ya registrado.
- Documentos adjuntos del anexo: se cargan como archivos (HU-028).
- Comunicación del anexo al cliente.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Registro de anexo | Anexo con motivo, fecha y descripción |
| CA-2 | Motivos válidos | Selector limitado a motivos de anexo |
| CA-3 | Anexo que modifica valores | Cambio de prima o valor asegurado |
| CA-4 | Póliza no vigente | Póliza vencida o cancelada |
| CA-5 | Fecha fuera de la vigencia | Fecha anterior al inicio o posterior al fin |

## Reglas para el `design.md`

- RN-1 — Un anexo pertenece siempre a una póliza y nunca cambia su número.
- RN-2 — Los anexos se numeran consecutivamente por póliza.
- RN-3 — Un anexo que modifica valores dispara una nueva liquidación (HU-015), sin borrar la anterior.
- El anexo queda registrado en la actividad y en el historial de la póliza (HU-030).

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET/POST | `/api/polizas/{id}/anexos` | Listar y crear |

## Reutilización visual

- Pestaña "Anexos" ya existente en `polizas/PolizaDetailPage.tsx` (hoy con contenido de marcador).
- Clases: `.tblwrap`, `.tbl`, `.badge`, `.btn.btn-pri`, `components/ui/Modal.tsx` para el alta,
  `.fgrid`, `.field`, `.sel`, `.inp`, `.empty` cuando no hay anexos.
- `data-testid` en el contador de la pestaña, en el botón de crear y en las filas.

## Verificación

- Unitarias: consecutivo por póliza, validación de fecha y de estado, recálculo de la liquidación y
  conservación de los valores anteriores.
- E2E `e2e/specs/hu-027-anexos.spec.ts`: crear un anexo y verificar contador e historial.

## Decisiones abiertas

1. **Qué campos puede modificar un anexo**: la HU nombra prima y valor asegurado; ¿también vigencia
   (prórroga) o asegurados de una colectiva? El alcance define el modelo.
2. **Efecto en la comisión**: si el anexo cambia la prima, ¿genera comisión adicional para el
   vendedor y entra en el periodo (HU-018)? Decisión con impacto económico.
3. **Numeración**: ¿consecutivo simple (1, 2, 3) o con el número de la póliza como prefijo? Lo
   segundo es lo habitual en el sector.
4. **Anexo sobre póliza por vencer**: CA-4 bloquea vencidas y canceladas; confirmar que una póliza
   por vencer sí admite anexos.
