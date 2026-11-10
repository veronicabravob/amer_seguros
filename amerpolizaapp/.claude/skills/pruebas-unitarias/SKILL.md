---
name: pruebas-unitarias
description: Cómo se escriben y ejecutan las pruebas unitarias del proyecto — pytest para el backend Django Ninja y Vitest para el frontend React. Úsala cada vez que implementes lógica de negocio, un servicio, un cálculo o un componente, y siempre antes de cerrar una tarea o una feature.
---

# Pruebas unitarias

## Backend — pytest

- Ubicación: `api/apps/<app>/tests/test_<modulo>.py`.
- Estilo: Arrange–Act–Assert, un comportamiento por prueba, nombre que describe la regla:
  `test_no_permite_dos_polizas_con_el_mismo_numero_en_la_misma_aseguradora`.
- Datos con `factory_boy` + `Faker` en español (`Faker('es_CO')`). **Nunca** datos reales.
- Casos de borde obligatorios en todo cálculo: cero, negativo, redondeo, valor máximo, nulo.
- Se prueban los **servicios** (lógica) y los **endpoints** (contrato: código de estado y esquema).
- Comando: `cd api && pytest -q --cov=apps --cov-report=term-missing`.
- Umbral: **80 % de cobertura** en la lógica de negocio nueva; el cálculo de prima y comisiones
  (HU-015, HU-018) exige **100 % de ramas**.

## Frontend — Vitest

- Ubicación: junto al archivo, `Componente.test.tsx` / `helpers.test.ts`.
- Se prueban funciones puras de `app/src/data/helpers.ts` y componentes con
  `@testing-library/react`: se consulta por rol y por texto visible, no por clases CSS.
- Comando: `cd app && npm run test:unit`.

## Regla de trazabilidad

Cada criterio de aceptación de la HU que sea una **regla de negocio** tiene al menos una prueba
unitaria, y el nombre de la prueba cita la HU:

```python
def test_hu015_ca2_ramo_sin_iva_deja_prima_neta_igual_al_total(): ...
```

## Cuándo se corren

- Al terminar cada tarea de `tasks.md`.
- Obligatoriamente antes de marcar una feature o una épica como terminada.
- En CI, en cada push.
