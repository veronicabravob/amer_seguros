# Historias de usuario — AMER Pólizas

Este catálogo se derivó por ingeniería inversa del prototipo React que vive en `app/`.
Cada HU describe **comportamiento observable**, no implementación, para que pueda
convertirse casi literalmente en una especificación de OpenSpec (`### Requirement` +
`#### Scenario`) y en un caso de prueba funcional de Playwright.

## Cómo leer una HU

| Sección | Para qué sirve |
|---|---|
| Historia | El valor: rol, capacidad, beneficio |
| Contexto en el prototipo | Dónde se ve hoy en `app/` (pantalla y ruta) |
| Criterios de aceptación | **CUANDO / ENTONCES** — cada uno es un `#### Scenario` y una prueba E2E |
| Reglas de negocio | Restricciones que van al backend y a las pruebas unitarias |
| Datos y API | Campos y endpoints propuestos para Django Ninja |
| Hecho cuando | Definition of Done de la HU |

## Convención de identificadores

`HU-###` es estable: se cita en el commit, en la rama, en el nombre del cambio de
OpenSpec (`openspec/changes/hu-###-<slug>/`) y en el `test.describe()` de Playwright.

## Índice

### E0 — Fundación técnica y acceso
- [HU-001 — Autenticación de usuario](HU-001-autenticacion.md)
- [HU-002 — Estructura de navegación de la aplicación](HU-002-navegacion.md)
- [HU-003 — Búsqueda global](HU-003-busqueda-global.md)

### E1 — Catálogos maestros
- [HU-004 — Gestionar aseguradoras](HU-004-aseguradoras.md)
- [HU-005 — Gestionar ramos y subramos](HU-005-ramos.md)
- [HU-006 — Catálogos simples de configuración](HU-006-catalogos-simples.md)
- [HU-007 — Gestionar sedes](HU-007-sedes.md)

### E2 — Clientes
- [HU-008 — Listar y filtrar clientes](HU-008-listar-clientes.md)
- [HU-009 — Crear cliente](HU-009-crear-cliente.md)
- [HU-010 — Ver detalle de cliente](HU-010-detalle-cliente.md)
- [HU-011 — Editar cliente y cambiar su estado](HU-011-editar-cliente.md)

### E3 — Pólizas
- [HU-012 — Listar pólizas con filtros y vistas](HU-012-listar-polizas.md)
- [HU-013 — Ver detalle de póliza](HU-013-detalle-poliza.md)
- [HU-014 — Crear póliza (asistente de 4 pasos)](HU-014-crear-poliza.md)
- [HU-015 — Cálculo de prima, IVA y comisión](HU-015-calculo-prima.md)
- [HU-016 — Renovar póliza](HU-016-renovar-poliza.md)

### E4 — Vendedores y comisiones
- [HU-017 — Gestionar vendedores](HU-017-vendedores.md)
- [HU-018 — Comisión liquidada por póliza](HU-018-comision-poliza.md)

### E5 — Usuarios y permisos
- [HU-019 — Gestionar usuarios de la agencia](HU-019-usuarios.md)
- [HU-020 — Control de acceso por rol](HU-020-roles-permisos.md)

### E6 — Tablero y alertas
- [HU-021 — Indicadores del tablero](HU-021-kpis.md)
- [HU-022 — Bandeja "Requiere tu atención"](HU-022-requiere-atencion.md)
- [HU-023 — Producción mensual y cartera por ramo](HU-023-produccion-cartera.md)

### E7 — Operación masiva y comunicaciones
- [HU-024 — Selección múltiple y acciones masivas](HU-024-acciones-masivas.md)
- [HU-025 — Exportar listados](HU-025-exportar.md)
- [HU-026 — Notificaciones automáticas al cliente](HU-026-notificaciones.md)

### E8 — Expediente de la póliza
- [HU-027 — Anexos de póliza](HU-027-anexos.md)
- [HU-028 — Archivos adjuntos](HU-028-archivos.md)
- [HU-029 — Bitácora de cobro](HU-029-bitacora-cobro.md)
- [HU-030 — Siniestros e historial de la póliza](HU-030-siniestros-historial.md)

> **Nota sobre datos.** Los datos de `app/src/data/mockData.ts` fueron anonimizados:
> documentos, cédulas, NIT de clientes, teléfonos, correos, direcciones de sedes y
> nombres de personas naturales son ficticios. Ver `docs/DATOS.md`.
