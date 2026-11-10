---
name: gate-de-entrega
description: Puerta de calidad obligatoria antes de dar por terminada cualquier tarea, feature o épica del proyecto AMER Pólizas. Úsala automáticamente al terminar de implementar algo, antes de marcar tareas como completas en tasks.md, antes de hacer commit y antes de abrir un PR. Define qué se ejecuta, en qué orden y qué evidencia se produce.
---

# Puerta de entrega — nada se cierra sin pasar por aquí

## Nivel 1 — al terminar una tarea de `tasks.md`

```bash
cd api && ruff check . && pytest -q          # backend
cd ../app && npm run lint && npm run test:unit   # frontend
```

Sólo con ambos en verde se marca la tarea como `- [x]`.

## Nivel 2 — al terminar una feature (una HU completa)

1. Nivel 1 en verde.
2. Pruebas E2E de esa HU:
   `npx playwright test e2e/specs/hu-XXX-*.spec.ts`
3. Verificación contra la spec: cada `#### Scenario` del cambio de OpenSpec tiene su `test()`.
   Si falta uno, se escribe antes de continuar.
4. Commit con el identificador de la HU.

## Nivel 3 — al cerrar una épica

1. Nivel 2 en verde para todas sus HU.
2. **Regresión completa**: `npx playwright test` (toda la suite, no sólo lo nuevo).
3. Cobertura: `pytest --cov=apps --cov-report=term-missing` ≥ 80 % en lo nuevo.
4. Evidencia en `e2e/evidencia/`: videos y capturas de los escenarios principales.
5. `openspec validate --strict` sin errores y `/opsx:verify` sin hallazgos abiertos.
6. `/opsx:archive` del cambio.
7. PR a `develop` con: resumen, HU cubiertas, enlace al reporte de Playwright, y capturas.

## Si algo falla

- **No** se marca la tarea como terminada.
- **No** se comenta ni se salta la prueba para que pase.
- Se corrige la causa. Si la prueba estaba mal escrita, se corrige la prueba explicando por qué
  en el commit.
- Si una prueba de otra épica se rompe, es una regresión real: se arregla antes de seguir.

## Reporte al usuario

Al terminar cada nivel, informa en una tabla: qué se ejecutó, cuántas pruebas pasaron, cuántas
fallaron, cobertura y dónde quedó la evidencia.
