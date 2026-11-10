# Brief — HU-022 · Bandeja "Requiere tu atención"

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-022-requiere-atencion` |
| **HU fuente** | `docs/hu/HU-022-requiere-atencion.md` |
| **Épica** | E7 — Tablero y alertas |
| **Prioridad** | Must |
| **Depende de** | HU-012, HU-016 |
| **Capacidad** | `bandeja-atencion` (ADDED) |

## Intención

Un asesor no puede revisar toda la cartera cada mañana. La bandeja convierte el tablero en una
lista de trabajo priorizada —vencidas, por vencer y cobros pendientes— donde cada fila lleva
directamente a la acción que la resuelve, en lugar de obligar a buscar la póliza.

## Alcance

- Composición de la bandeja con pólizas vencidas, por vencer en 30 días y cobros pendientes.
- Orden por urgencia y semáforo de color por tipo.
- Acción directa por fila (Renovar, Gestionar, Recordar, Contactar) que abre el flujo
  correspondiente con los datos precargados.
- Estado vacío cuando no hay pendientes.
- Alcance por rol y acción "Ver todo" que lleva al listado con el filtro aplicado.
- Salida inmediata de la bandeja cuando la póliza se renueva.

## Fuera de alcance

- Los indicadores superiores: HU-021.
- El envío de recordatorios al cliente: HU-026 (aquí el botón abre el flujo, no envía).
- La bitácora de cobro en sí: HU-029; esta bandeja sólo la refleja.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Composición de la bandeja | Apertura del tablero con pendientes de los tres tipos |
| CA-2 | Semáforo por urgencia | Elemento vencido, por vencer y de renovación |
| CA-3 | Acción directa | "Renovar" sobre un elemento |
| CA-4 | Bandeja vacía | No hay pendientes |
| CA-5 | Alcance por rol | Asesor frente a administrador |
| CA-6 | Ver todo | Navegación al listado con el filtro aplicado |

## Reglas para el `design.md`

- RN-1 — Orden: vencidas primero (las más antiguas arriba), luego por vencer (menos días arriba),
  luego renovaciones.
- RN-2 — Máximo 10 elementos; el resto se consulta con "Ver todo".
- RN-3 — Una póliza renovada sale de la bandeja inmediatamente (enlaza con HU-016 CA-3).
- Los colores salen de los tokens existentes: `--red` vencido, `--amb` por vencer, `--teal`
  renovación. Ningún color literal.

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/dashboard/atencion` | Elementos priorizados |

## Reutilización visual

- Bloque existente en `pages/DashboardPage.tsx`.
- Clases: `.card`, `.pad`, `.tbl` o `.timeline` según la fila actual, `.badge` con `.st-vencer` /
  `.st-vencida`, `.b-dot`, `.btn.btn-sm`, `.empty`.
- `data-testid` en cada fila, en su botón de acción y en el estado vacío.

## Verificación

- Unitarias del ordenamiento por urgencia, del límite de 10 elementos y de la clasificación por
  tipo.
- E2E `e2e/specs/hu-022-requiere-atencion.spec.ts`: CA-1, CA-3, CA-4 y CA-6.
- Demo de la épica: desde la bandeja, renovar en un clic y comprobar que el elemento desaparece.

## Decisiones abiertas

1. **"Cobros pendientes"**: dependen de la bitácora de HU-029, que está en E9, mientras la bandeja
   está en E7. Propuesta: especificar los tres tipos y entregar en E7 sólo vencidas y por vencer,
   dejando el tipo Cobro y su prueba pendientes hasta E9. Confirmar antes de la spec.
2. **Qué hacen "Recordar" y "Contactar"**: sin HU-026 no hay envío. ¿Abren el correo del cliente,
   registran una gestión, o se dejan fuera hasta E8?
3. **Límite de 10 frente a "ver todo"**: definir el filtro exacto que recibe el listado en cada tipo,
   para que el conteo coincida con lo que ve el usuario.
