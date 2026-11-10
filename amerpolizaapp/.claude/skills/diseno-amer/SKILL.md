---
name: diseno-amer
description: Reglas visuales obligatorias del prototipo AMER Pólizas. Úsala SIEMPRE que vayas a crear o modificar una pantalla, un componente o una hoja de estilos del frontend en app/, incluidas pantallas nuevas como el login. Garantiza que todo lo nuevo se vea como lo que ya existe.
---

# Diseño AMER — no se inventa, se reutiliza

## Antes de escribir una línea de JSX

1. Lee `docs/DESIGN-SYSTEM.md` completo.
2. Abre la pantalla existente más parecida a la que vas a construir y cópiale la estructura:
   - listado con filtros → `app/src/pages/clientes/ClientesListPage.tsx`
   - formulario largo → `app/src/pages/config/VendedorFormPage.tsx`
   - formulario por pasos → `app/src/pages/polizas/PolizaCreatePage.tsx`
   - ficha de detalle → `app/src/pages/polizas/PolizaDetailPage.tsx`
   - tarjeta simple centrada (base para el login) → bloque `.card` + `.fgrid`/`.field` de cualquier formulario
3. Enumera en voz alta qué clases existentes vas a usar. Si crees que necesitas una clase nueva,
   primero busca en `app/src/styles/global.css` con `grep`; casi siempre ya existe.

## Prohibido

- Introducir Tailwind, Bootstrap, MUI, styled-components o cualquier librería de UI.
- Colores, sombras, radios o tipografías literales: se usan `var(--brand)`, `var(--line)`, etc.
- Rehacer el marco de la aplicación: la barra lateral y la superior las pone `AppShell`.
- Textos en inglés en la interfaz.
- Componentes nuevos que dupliquen a `Chips`, `Modal`, `StatusBadge`, `Switch` o `Tabs`.

## Obligatorio

- Estructura de página: `.pagehd` → (`.tabs`) → `.toolbar` → contenido en `.card` → `.pager`.
- Botón principal: `btn btn-pri`; secundario: `btn`; en tabla: `actbtn`.
- Estados de póliza con `badge` + `st-vigente | st-vencer | st-vencida`.
- Cada `input` con su `label className="lbl"`; obligatorio marcado con `<span className="req">*</span>`.
- Botones de sólo icono con `aria-label`.
- `data-testid` estable en todo elemento que una prueba E2E vaya a usar. Convención:
  `data-testid="<entidad>-<elemento>"` → `poliza-fila`, `cliente-buscador`, `btn-guardar-cliente`.
- Formato de dinero siempre con el helper `fmt()` de `app/src/data/helpers.ts`.

## Al terminar

Levanta `npm run dev`, abre la pantalla nueva junto a una existente y compara: alturas de campo,
radios, espaciados, tamaño de título. Si algo se ve distinto, está mal.
