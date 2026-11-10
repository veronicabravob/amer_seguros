# Backlog priorizado por épicas — AMER Pólizas

## Cómo se priorizó

Cuatro criterios, en este orden:

1. **Dependencia técnica** — nada se construye antes que aquello que lo habilita (sin acceso no hay módulos; sin catálogos no hay pólizas).
2. **Valor para la operación** — primero lo que la agencia usa todos los días: pólizas y clientes.
3. **Riesgo** — lo que puede salir mal (cálculo de prima y comisiones, permisos) se aborda temprano, cuando queda tiempo para corregir.
4. **Demostrabilidad** — cada épica debe terminar en algo con lo que una persona pueda **interactuar**, no en una capa técnica invisible.

El cuarto criterio manda sobre el resto: si una épica no produce pantalla usable, se reparte
entre las que sí.

## Regla de cierre de épica (Definition of Done)

Una épica se da por cerrada sólo cuando:

- [ ] Todas sus HU tienen sus escenarios implementados y verificados.
- [ ] `pytest` pasa con cobertura ≥ 80 % en la lógica de negocio nueva.
- [ ] La suite de Playwright de la épica pasa **y** la suite de regresión completa sigue en verde.
- [ ] Hay evidencia: video y capturas de los escenarios principales en `e2e/evidencia/`.
- [ ] El cambio de OpenSpec está archivado (`/opsx:archive`) y las specs quedaron actualizadas.
- [ ] La rama está mezclada a `develop` mediante PR revisado.

## Mapa de épicas

| # | Épica | HU | Entregable interactivo | Depende de | Tamaño |
|---|---|---|---|---|---|
| E0 | Fundación y acceso | HU-001, HU-002, HU-003 | Pantalla de login real; al entrar, el nombre y rol vienen de la base de datos y la búsqueda superior consulta la API | — | M |
| E1 | Catálogos maestros | HU-004 … HU-007 | Módulo Configuración operando contra la API: crear una aseguradora, un ramo, una cobertura y una sede y verlos en pantalla | E0 | L |
| E2 | Usuarios y permisos | HU-019, HU-020 | Crear un usuario asesor, entrar con él y comprobar que no ve Configuración | E0, E1 | M |
| E3 | Clientes | HU-008 … HU-011 | Alta de un cliente persona y uno empresa, búsqueda, ficha con sus pólizas y cambio de estado | E1 | L |
| E4 | Pólizas — consulta | HU-012, HU-013 | Listado con filtros, chips y vistas tabla/tarjetas, y detalle completo por pestañas, con datos reales | E1, E3 | L |
| E5 | Pólizas — emisión | HU-014, HU-015 | Asistente de 4 pasos que emite una póliza y muestra su liquidación correcta | E4 | XL |
| E6 | Vendedores y comisiones | HU-017, HU-018, HU-016 | Alta de vendedor con su esquema, renovación de una póliza y consulta de comisiones del periodo | E5 | L |
| E7 | Tablero y alertas | HU-021, HU-022, HU-023 | Tablero con indicadores calculados y bandeja "Requiere tu atención" que lleva a la acción | E4, E5 | M |
| E8 | Operación masiva y comunicaciones | HU-024, HU-025, HU-026 | Selección múltiple con exportación a Excel y aviso automático de vencimiento | E4, E3 | M |
| E9 | Expediente de la póliza | HU-027 … HU-030 | Pestañas de anexos, archivos, bitácora de cobro, siniestros e historial con datos reales | E5 | L |

## Orden de ejecución propuesto

```
E0 ─► E1 ─► E2 ─► E3 ─► E4 ─► E5 ─► E6 ─► E7 ─► E8 ─► E9
                    └────────────► (E7 puede adelantarse si se necesita demo temprana)
```

## Detalle por épica

### E0 — Fundación y acceso · *Must*
**Por qué primero:** sin autenticación no hay usuario, sin usuario no hay auditoría ni permisos, y
todo lo demás quedaría por rehacer.
**Alcance:** proyecto Django + Django Ninja, base de datos, modelo de usuario, login/logout,
`GET /me`, protección de rutas en el frontend, semilla de datos anonimizados.
**Demo:** entrar con dos usuarios distintos y ver su nombre y rol en la barra lateral.
**Riesgo:** manejo del token en el frontend. **Mitigación:** definirlo en el `design.md` del cambio.

### E1 — Catálogos maestros · *Must*
**Por qué:** pólizas, clientes y comisiones dependen de aseguradoras, ramos, sedes y catálogos simples.
**Demo:** crear un ramo con dos aseguradoras y verlo reflejado en el selector del asistente de póliza.

### E2 — Usuarios y permisos · *Must*
**Por qué aquí:** ya existen sedes (E1) y hace falta antes de exponer módulos con datos sensibles.
**Demo:** el mismo sistema visto por un administrador y por un asesor.

### E3 — Clientes · *Must*
**Por qué:** es el registro que más se usa a diario y es prerrequisito de la emisión.
**Demo:** alta de cliente desde el modal de tipo hasta su ficha con pólizas.

### E4 — Pólizas, consulta · *Must*
**Por qué:** entrega valor inmediato aun antes de poder emitir desde el sistema.
**Demo:** filtrar "Por vencer", abrir una póliza y recorrer sus pestañas.

### E5 — Pólizas, emisión · *Must*
**Por qué:** es el corazón del producto y el mayor riesgo de cálculo.
**Demo:** emitir una póliza completa y comparar su liquidación contra un cálculo hecho a mano.
**Riesgo:** aritmética de prima, IVA y comisión. **Mitigación:** HU-015 con pruebas unitarias de borde antes de la interfaz.

### E6 — Vendedores y comisiones · *Should*
**Demo:** liquidar el periodo de un vendedor y renovar una póliza heredando sus datos.

### E7 — Tablero y alertas · *Should*
**Demo:** el tablero deja de mostrar números fijos y la bandeja lleva a renovar en un clic.

### E8 — Operación masiva y comunicaciones · *Should*
**Demo:** seleccionar cinco pólizas por vencer, exportarlas y disparar el aviso al cliente.

### E9 — Expediente de la póliza · *Could*
**Demo:** cargar la póliza firmada, registrar una gestión de cobro y ver todo en el historial.

## Qué queda fuera de este backlog (por ahora)

- Integración con las plataformas de las aseguradoras.
- Facturación electrónica y conciliación bancaria.
- Aplicación móvil.
- Portal de autogestión para el cliente final.
