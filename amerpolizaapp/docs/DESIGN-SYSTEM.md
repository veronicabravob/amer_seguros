# Sistema de diseño existente — contrato visual

**Regla número uno del proyecto: no se inventa diseño.** Toda pantalla nueva (empezando por el
login) se construye con los tokens, las clases y los componentes que ya existen en `app/`.
Este documento es el inventario. Se le entrega al agente como contexto antes de escribir código.

## 1. Tokens de color (`app/src/styles/global.css`, `:root`)

| Token | Valor | Uso |
|---|---|---|
| `--brand` / `--brand-d` / `--brand-t` | `#0A5C8A` / `#07456A` / `#E4F0F6` | Azul institucional: botón primario, ítem de menú activo, enlaces |
| `--teal` / `--teal-t` | `#0FA6B8` / `#E0F5F7` | Acentos, barras de progreso |
| `--ink` / `--ink2` / `--mut` | `#0C2233` / `#3D5266` / `#6E869B` | Texto principal, secundario, atenuado |
| `--line` / `--line2` | `#E3EAF0` / `#EDF2F6` | Bordes de tarjeta y separadores internos |
| `--bg` / `--card` | `#F4F8FB` / `#FFFFFF` | Fondo de la aplicación y de las tarjetas |
| `--grn` / `--grn-t` | `#0C8A62` / `#E2F1EB` | Éxito, vigente, variación al alza |
| `--amb` / `--amb-t` | `#B07A1E` / `#F6EEDF` | Advertencia, por vencer |
| `--red` / `--red-t` | `#C1455A` / `#F6E7EB` | Error, vencida, variación a la baja |

**Nunca** se escribe un color literal en un componente: se usa `var(--token)`.

## 2. Tipografía

- Familia base: `'Plus Jakarta Sans', system-ui, sans-serif`.
- Monoespaciada para números de póliza y documentos: clase `.mono` (`'IBM Plex Mono'`).
- Títulos de página: `.h1` (23 px, peso 800). Subtítulo: `.psub`. Título de sección: `.sec-t` / `.sc-hd`.

## 3. Estructura de una pantalla

```tsx
<>
  <div className="pagehd">
    <div>
      <h1 className="h1">Título</h1>
      <p className="psub">Subtítulo con contexto</p>
    </div>
    <button className="btn btn-pri">Acción principal</button>
  </div>
  {/* pestañas opcionales */} <div className="tabs">…</div>
  {/* filtros */}            <div className="toolbar">…</div>
  {/* contenido */}          <div className="card tblwrap">…</div>
  {/* paginación */}         <div className="pager">…</div>
</>
```

El marco (barra lateral + barra superior) lo pone `AppShell`; una página **nunca** lo repite.

## 4. Clases que ya existen (usar, no reinventar)

| Necesidad | Clases |
|---|---|
| Botones | `.btn`, `.btn-pri`, `.btn-sm`, `.btn-gh` |
| Contenedores | `.card`, `.pad`, `.grid2`, `.dash-grid`, `.det-grid` |
| Formularios | `.fgrid`, `.field`, `.field.full`, `.lbl`, `.req`, `.inp`, `.hint`, `.form-h`, `.form-hd`, `.form-foot` |
| Tablas | `.tblwrap`, `.tbl`, `.prow`, `.prow.sel`, `.ck`, `.rowact`, `.actbtn`, `.pager`, `.pgb` |
| Estados | `.badge` + `.st-vigente` / `.st-vencer` / `.st-vencida` / `.st-off`, `.b-dot`, `.tag-new`, `.tag-ren` |
| Filtros | `.toolbar`, `.chips`, `.chip`, `.chip.on`, `.chip-ct`, `.sel`, `.selctl`, `.seg` |
| Indicadores | `.kpis`, `.kpi`, `.kpi-ic`, `.kpi-num`, `.kpi-lbl`, `.kpi-dl` + `.up`/`.dn`/`.wn` |
| Detalle | `.det-hd`, `.det-title`, `.det-meta`, `.det-vig`, `.info-grid`, `.info-item`, `.kv`, `.side-card` |
| Asistente por pasos | `.c2-wrap`, `.c2-idx`, `.c2-item`, `.c2-form`, `.form-step`, `.mini-prog`, `.sum` |
| Otros | `.timeline`, `.tl-item`, `.modal`, `.modal-ov`, `.empty`, `.switch`, `.tp`, `.cav`, `.money`, `.mono` |

## 5. Componentes reutilizables (`app/src/components/ui/`)

`Chips`, `Modal`, `StatusBadge`, `Switch`, `Tabs`. Antes de crear un componente nuevo se revisa
si uno de estos cubre el caso; si hay que crear uno, se ubica en la misma carpeta y sigue el
mismo estilo de API (props explícitas, sin estado global).

## 6. Reglas de construcción

1. **CSS**: se amplía `global.css` con clases nuevas siguiendo la nomenclatura corta existente.
   No se introduce Tailwind, CSS-in-JS ni librerías de componentes.
2. **Iconos**: SVG en línea, `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`,
   `strokeWidth` entre 2 y 2.2.
3. **Radios y alturas**: tarjetas 14 px, botones e inputs 10 px de radio y 38–42 px de alto.
4. **Idioma**: toda la interfaz en español, con las etiquetas del negocio asegurador que ya usa la app.
5. **Datos de prueba**: se usan los del catálogo anonimizado; no se inventan nombres reales.
6. **Accesibilidad**: todo `input` tiene `label`; los botones de sólo icono llevan `aria-label`.
7. **Pruebas**: cada elemento con el que interactúa una prueba E2E lleva `data-testid`
   estable (`data-testid="poliza-fila"`, `data-testid="btn-crear-poliza"`).

## 7. Cómo se crea una pantalla nueva (por ejemplo, el login)

1. Se toma una pantalla existente parecida como referencia (para el login: la tarjeta
   `.card` + bloque `.fgrid`/`.field`/`.inp` + `.btn.btn-pri`).
2. Se reutilizan el logo de `public/assets/amer-logo-white.png` y el degradado de `.side`.
3. No se agregan colores, fuentes ni sombras que no estén en este documento.
4. Antes de dar la pantalla por terminada se compara contra una pantalla existente en el
   navegador: mismos radios, mismas alturas, mismo espaciado.
