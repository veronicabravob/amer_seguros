---
name: flujo-git-agente
description: Flujo de trabajo con Git y GitHub para el proyecto AMER Pólizas — ramas por épica y por HU, mensajes de commit, pull requests y qué nunca se sube al repositorio. Úsala al iniciar cualquier trabajo nuevo, al hacer commit, al subir cambios y al abrir un PR.
---

# Flujo de Git

## Ramas

```
main         # sólo versiones estables y desplegables
develop      # integración
epica/E5-polizas-emision          # una por épica
feat/HU-014-crear-poliza          # una por HU, sale de la rama de la épica
fix/HU-014-validacion-vigencia    # correcciones
```

Al empezar una HU:

```bash
git switch epica/E5-polizas-emision
git pull --rebase
git switch -c feat/HU-014-crear-poliza
```

## Commits

Formato: `<tipo>(HU-XXX): <qué cambió, en imperativo>`

Tipos: `feat`, `fix`, `test`, `docs`, `refactor`, `chore`, `spec` (cambios en artefactos de OpenSpec).

```
feat(HU-014): agregar paso de vigencia con validación de fechas
test(HU-014): cubrir CA-4 fecha fin anterior al inicio
spec(HU-014): ajustar escenario de número de póliza duplicado
```

Un commit por cambio coherente. No se acumula la épica entera en un commit.

## Pull requests

- De `feat/HU-XXX` a la rama de la épica; de la épica a `develop`; de `develop` a `main`.
- El PR incluye: HU cubiertas, escenarios verificados, resultado de las pruebas, enlace al
  reporte de Playwright y capturas de las pantallas nuevas.
- No se mezcla con pruebas en rojo.

## Nunca se sube al repositorio

- `.env`, credenciales, tokens, llaves ni cadenas de conexión con contraseña.
- La base de datos con datos reales (`*.sqlite3`, volcados `.sql` de producción).
- `node_modules/`, `.venv/`, `__pycache__/`, `dist/`, `e2e/evidencia/artifacts/`.
- Datos personales reales de clientes: ver `docs/DATOS.md`.

Si detectas un secreto ya versionado, **detente y avísalo**; no lo borres en un commit nuevo como
si nada: hay que rotarlo y limpiar el historial.

## Comandos que el agente puede ejecutar sin preguntar

`git status`, `git diff`, `git add`, `git commit`, `git switch -c`, `git pull --rebase`,
`git push -u origin <rama>`, `gh pr create`.

## Comandos que requieren confirmación explícita del usuario

`git push --force`, `git reset --hard`, `git rebase` sobre ramas compartidas, `gh pr merge`,
cualquier cosa sobre `main`.
