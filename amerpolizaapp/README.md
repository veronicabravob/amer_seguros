# AMER Pólizas

Sistema de gestión de pólizas para una agencia de seguros. El repositorio parte de un prototipo
visual en React y avanza hacia un producto completo con backend en Python (Django + Django Ninja),
especificado con OpenSpec y verificado con pruebas unitarias y funcionales.

## Estructura

```
app/       Prototipo React 19 + TypeScript + Vite (datos simulados y anonimizados)
api/       Backend Django + Django Ninja  (se construye en la épica E0)
e2e/       Pruebas funcionales con Playwright
docs/
  hu/          30 historias de usuario derivadas del prototipo
  backlog/     Épicas priorizadas, cada una con su entregable interactivo
  guias/       Guía de desarrollo y biblioteca de prompts
  DESIGN-SYSTEM.md   Contrato visual: tokens, clases y componentes existentes
  DATOS.md           Política de datos y registro de anonimización
.claude/skills/  Buenas prácticas que el agente aplica automáticamente
openspec/        Especificaciones y cambios (se crea con `openspec init`)
```

## Empezar

1. Lee **`docs/guias/GUIA-DESARROLLO.md`** de principio a fin.
2. Levanta el prototipo: `cd app && npm install && npm run dev`.
3. Sigue el paso 1 de la guía (repositorio), luego el 2 (diseño) y el 3 (OpenSpec).

## Reglas que no se negocian

- El diseño no se inventa: se reutiliza (`docs/DESIGN-SYSTEM.md`).
- Toda funcionalidad nace de una HU y de un cambio de OpenSpec.
- Nada se cierra sin pruebas unitarias y funcionales en verde (`.claude/skills/gate-de-entrega`).
- Ningún dato personal real entra al repositorio (`docs/DATOS.md`).
