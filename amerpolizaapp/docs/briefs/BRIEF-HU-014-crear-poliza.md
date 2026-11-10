# Brief — HU-014 · Crear póliza (asistente de 4 pasos)

|  |  |
|---|---|
| **Cambio OpenSpec** | `hu-014-crear-poliza` |
| **HU fuente** | `docs/hu/HU-014-crear-poliza.md` |
| **Épica** | E5 — Pólizas, emisión |
| **Prioridad** | Must |
| **Depende de** | HU-009, HU-004, HU-005, HU-017 |
| **Capacidad** | `emision-polizas` (ADDED) |

## Intención

Es el corazón del producto: el momento en que la agencia registra lo que vendió. El asistente de
`polizas/PolizaCreatePage.tsx` ya guía los cuatro pasos, pero sin validaciones reales ni
persistencia. Este cambio define qué se exige en cada paso, cómo se valida la vigencia y la
unicidad del número, y cómo nace la póliza con su liquidación.

## Alcance

- Asistente de cuatro pasos con índice lateral, barra "Paso N de 4" y avance secuencial.
- Paso 1 identificación (tipo Individual / Colectiva / Agrupadora, número, cliente, aseguradora,
  ramo), con los campos condicionales de cada tipo.
- Paso 2 vigencia y riesgo, con validación de fechas.
- Paso 3 prima y comisiones, con total estimado en vivo y porcentajes propuestos desde ramo y
  aseguradora.
- Paso 4 vendedor y resumen, y creación de la póliza en estado Vigente con etiqueta NUEVA.
- Borrador recuperable al abandonar el asistente.

## Fuera de alcance

- La aritmética de la liquidación: se especifica en HU-015 (este cambio la **consume**).
- Editar una póliza ya emitida y renovarla: HU-016.
- Anexos, archivos y demás expediente: E9.
- Cotización o comparación de aseguradoras antes de emitir.

## Escenarios a especificar

| CA de la HU | Requirement propuesto | Scenario |
|---|---|---|
| CA-1 | Avance secuencial del asistente | Paso 1 completo y "Siguiente sección" |
| CA-2 | Bloqueo por campos obligatorios | Intento de avanzar sin número, cliente, aseguradora o ramo |
| CA-3 | Campos según el tipo de póliza | Individual, Colectiva y Agrupadora |
| CA-4 | Vigencia coherente | Fecha de fin anterior o igual al inicio |
| CA-5 | Número de póliza único | Número repetido en la misma aseguradora |
| CA-6 | Total estimado en vivo | Captura de la prima neta en el paso 3 |
| CA-7 | Emisión de la póliza | Confirmación en el paso 4 |
| CA-8 | Borrador del asistente | Abandono a medio camino |

## Reglas para el `design.md`

- RN-1 — El número de póliza es único por aseguradora.
- RN-2 — Vigencia mínima de un día; la fecha de expedición no puede ser posterior al inicio.
- RN-3 — El cliente debe existir y estar activo; el asesor asignado debe ser un vendedor activo.
- RN-4 — Los porcentajes de IVA y comisión se proponen desde el ramo y la aseguradora, y se pueden
  ajustar en el paso 3.
- Las validaciones del asistente se replican en el backend: avanzar de paso no sustituye la
  validación del `POST`.

## Superficie de API (Django Ninja)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/polizas` | Crear |
| POST | `/api/polizas/borrador` | Guardar borrador |
| GET | `/api/polizas/validar-numero?num=&aseguradora=` | Verificar unicidad |

## Reutilización visual

- Pantalla existente `polizas/PolizaCreatePage.tsx`.
- Clases: `.c2-wrap`, `.c2-idx`, `.c2-item`, `.c2-form`, `.form-step`, `.mini-prog`, `.sum`,
  `.fgrid`, `.field`, `.req`, `.inp`, `.sel`, `.hint`, `.money`, `.btn.btn-pri`.
- `data-testid` en cada paso del índice, en el botón "Siguiente sección", en los campos
  obligatorios y en el total estimado.

## Verificación

- Unitarias: validación de vigencia, unicidad del número, campos requeridos por tipo de póliza,
  propuesta de porcentajes desde ramo y aseguradora.
- E2E `e2e/specs/hu-014-crear-poliza.spec.ts`: recorrido completo de los cuatro pasos (CA-1 a CA-7)
  con video; es la demo de la épica.

## Decisiones abiertas

1. **Dependencia invertida con HU-017**: la HU depende de vendedores, que el backlog coloca en E6.
   Opciones: (a) adelantar un modelo mínimo de vendedor dentro de E5, (b) usar el usuario asesor de
   HU-019 como asignado y enlazarlo al vendedor en E6, o (c) mover HU-017 a E5. Hay que decidirlo
   **antes** de abrir el cambio.
2. **Total estimado en vivo (CA-6)**: RN-1 de HU-015 exige que todo cálculo sea del backend. ¿El
   paso 3 llama a `POST /api/polizas/liquidar` en cada cambio, con retardo, o se admite una
   estimación en el cliente? Recomendado: llamar al backend con retardo, para no tener dos
   aritméticas.
3. **Borrador (CA-8)**: ¿se guarda automáticamente ("Borrador guardado" aparece en el prototipo) o
   sólo al salir? ¿Cuánto vive? ¿Es visible para otros usuarios?
4. **Estado inicial**: CA-7 dice Vigente aunque la vigencia empiece en el futuro. Confirmar cómo
   convive con el estado calculado por fechas de HU-012.
