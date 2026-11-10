# AMER Seguros

Monorepo de los productos digitales de AMER Seguros.

```
amerpolizaapp/   Sistema de gestión de pólizas (React + Vite, Django + Django Ninja, Playwright)
landing/         Landing page pública (pendiente)
```

Cada proyecto tiene su propio README con las instrucciones para levantarlo:

- [`amerpolizaapp/README.md`](amerpolizaapp/README.md)
- [`landing/README.md`](landing/README.md)

## Ramas

| Rama | Uso |
|---|---|
| `main` | Sólo versiones estables y desplegables |
| `develop` | Integración |
| `epica/EX-...` | Una por épica, sale de `develop` |
| `feat/HU-XXX-...` / `fix/HU-XXX-...` | Una por HU, sale de la rama de su épica |

Flujo de PR: `feat/HU-XXX` → `epica/EX` → `develop` → `main`.
Detalle completo en `amerpolizaapp/.claude/skills/flujo-git-agente/SKILL.md`.
