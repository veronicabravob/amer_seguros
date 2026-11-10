# Brief — HU-013 · Ver detalle de póliza

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-013-detalle-poliza` |
| **HU fuente** | `docs/hu/HU-013-detalle-poliza.md` |
| **Épica** | E4 — Pólizas, consulta |
| **Prioridad** | Must |
| **Depende de** | HU-012 |
| **Capacidad** | `polizas` (MODIFIED: detalle y expediente) |

## Intención

El detalle es donde el asesor responde cualquier pregunta del cliente: cobertura, fechas, valores
y documentos. `polizas/PolizaDetailPage.tsx` ya define el esqueleto de pestañas; este cambio
especifica el contenido de Resumen y de Tomador y asegurado, la tarjeta de valores liquidados y la
navegación, y deja las demás pestañas declaradas para la épica del expediente (E9).

## Alcance

- Encabezado con número, estado, barra de vigencia y acciones (Editar, Renovar, Descargar).
- Pestaña Resumen: cliente, documento, aseguradora, ramo, riesgo, fechas de expedición, inicio y
  fin, renovable, forma de pago y asesor asignado.
- Tarjeta lateral de valores: prima anual, prima neta, gastos, IVA, comisión, valor asegurado y
  total a pagar.
- Pestaña Tomador y asegurado, con beneficiario oneroso o "No aplica".
- Navegación entre pestañas sin recargar, retorno al listado conservando filtros y manejo de
  póliza inexistente.
- Contadores reales en las pestañas de anexos, archivos y siniestros.

## Fuera de alcance

- El contenido de las pestañas Anexos, Archivos, Bitácora de cobro, Historial y Siniestros:
  HU-027, HU-028, HU-029 y HU-030. Aquí sólo existen y muestran su contador.
- El cálculo de los valores: se especifica en HU-015; aquí se **muestran**.
- La acción Descargar el documento de la póliza: sin criterios en la HU.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Resumen de la póliza | Apertura de `/polizas/{id}` |
| CA-2 | Valores liquidados | Tarjeta lateral coherente con HU-015 |
| CA-3 | Tomador y asegurado | Pestaña con ambos y su relación |
| CA-4 | Beneficiario oneroso no aplicable | Ramo que no lo exige |
| CA-5 | Navegación entre pestañas | Cambio de pestaña sin recargar |
| CA-6 | Retorno al listado | "Volver al listado" conservando filtros |
| CA-7 | Póliza inexistente | Identificador que no existe |

## Reglas para el `design.md`

- RN-1 — La fecha de expedición por defecto es 8 días antes del inicio de vigencia.
- RN-2 — El detalle es de sólo lectura; los cambios se hacen desde Editar o Renovar.
- RN-3 — Los contadores de las pestañas muestran el número real de registros.
- Los valores de comisión sólo se muestran a quien tiene permiso (HU-020 RN-2).

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/polizas/{id}` | Detalle con liquidación |
| GET | `/api/polizas/{id}/actividad` | Eventos de la póliza |

## Reutilización visual

- Pantalla existente `polizas/PolizaDetailPage.tsx` y componente `components/ui/Tabs.tsx`.
- Clases: `.det-hd`, `.det-title`, `.det-meta`, `.det-vig`, `.det-grid`, `.info-grid`, `.info-item`,
  `.kv`, `.side-card`, `.money`, `.badge` de estado, `.empty`, `.timeline`.
- `data-testid` en cada pestaña, en el bloque de valores y en el botón de volver.

## Verificación

- Unitarias del armado del detalle, de la regla de beneficiario oneroso y de los contadores.
- E2E `e2e/specs/hu-013-detalle-poliza.spec.ts`: CA-1, CA-3, CA-5, CA-6 y CA-7.

## Decisiones abiertas

1. **Conservación de los filtros al volver (CA-6)**: ¿los filtros viajan en la URL del listado o se
   guardan en el contexto del cliente? La URL es más simple de probar y permite compartir enlaces.
2. **Beneficiario oneroso**: ¿qué configuración decide que "el ramo lo exige"? Si es un atributo del
   ramo, hay que agregarlo a HU-005 antes de especificar CA-4.
3. **Relación tomador/asegurado**: ¿catálogo de relaciones o texto libre? Y si el asegurado puede
   ser un cliente distinto del tomador, confirmar que ambos son clientes registrados.
4. **Forma de pago**: no aparece en ninguna otra HU ni catálogo. Definir su origen (lista fija o
   catálogo simple de HU-006).
