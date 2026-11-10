# Brief — HU-029 · Bitácora de cobro

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-029-bitacora-cobro` |
| **HU fuente** | `docs/hu/HU-029-bitacora-cobro.md` |
| **Épica** | E9 — Expediente de la póliza |
| **Prioridad** | Should |
| **Depende de** | HU-013, HU-020 |
| **Capacidad** | `bitacora-cobro` (ADDED) · `bandeja-atencion` (MODIFIED: cobros pendientes) |

## Intención

El perfil de Cobros existe en el sistema pero no tiene dónde trabajar. Sin bitácora, nadie sabe qué
se le dijo al cliente ni cuándo hay que volver a llamarlo, y la bandeja del tablero no puede
mostrar cobros pendientes. Este cambio le da a Cobros su registro y cierra el tipo que falta en
HU-022.

## Alcance

- Registro de gestiones de cobro con canal, resultado, observación y fecha de próximo contacto.
- Bitácora ordenada de la más reciente a la más antigua.
- Estado de cobro de la póliza derivado del resultado de la gestión.
- Registro de pagos con disminución del saldo pendiente y evento en la actividad.
- Lectura para los perfiles sin permiso de registrar.
- Aparición en la bandeja "Requiere tu atención" al llegar la fecha de próximo contacto.

## Fuera de alcance

- Conciliación bancaria y facturación electrónica (fuera del backlog).
- Planes de pago y financiación de la prima.
- Envío automático del recordatorio al cliente: HU-026.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Registro de gestión | Gestión con canal, resultado y próximo contacto |
| CA-2 | Estado de cobro de la póliza | Resultado "Pago comprometido" |
| CA-3 | Registro de pago | Pago con valor y fecha |
| CA-4 | Permisos de la bitácora | Asesor comercial en modo lectura |
| CA-5 | Próximo contacto en la bandeja | Llega la fecha comprometida |

## Reglas para el `design.md`

- RN-1 — Canales: llamada, WhatsApp, correo, visita.
- RN-2 — Una gestión registrada no se edita ni se borra; se corrige con una gestión nueva.
- RN-3 — El valor del pago no puede exceder el saldo pendiente.
- El saldo pendiente se deriva del total a pagar de la liquidación (HU-015) menos los pagos
  registrados; no se captura a mano.

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET/POST | `/api/polizas/{id}/cobros` | Bitácora y registro de gestión |
| POST | `/api/polizas/{id}/pagos` | Registrar pago |

## Reutilización visual

- Pestaña "Bitácora de cobro" ya existente en `polizas/PolizaDetailPage.tsx`.
- Clases: `.timeline`, `.tl-item` para la bitácora, `.badge` para el resultado, `.fgrid`, `.field`,
  `.sel`, `.inp`, `.money` para el pago, `.empty` sin gestiones.
- `data-testid` en el formulario de gestión, en cada entrada de la bitácora y en el saldo.

## Verificación

- Unitarias: cálculo del saldo, inmutabilidad de la gestión, tope del valor del pago, permisos por
  rol.
- E2E `e2e/specs/hu-029-bitacora-cobro.spec.ts`: registrar una gestión y verificarla en la bandeja.

## Decisiones abiertas

1. **Estados de cobro de la póliza (CA-2)**: no existe catálogo. ¿Lista fija (Al día, Pago
   comprometido, En mora, Pagada) o catálogo simple de HU-006? Sin definirla, CA-2 no es verificable.
2. **Catálogo de resultados de gestión**: igual que el anterior; hoy no está en ninguna HU.
3. **Saldo inicial**: ¿la póliza nace con saldo igual al total a pagar, o hay un plan de cuotas? Si
   hay cuotas, el alcance crece mucho y conviene proponerlo aparte.
4. **Permiso de registrar pagos**: ¿sólo Cobros, o también Administrador? Entra en la matriz de
   HU-020.
