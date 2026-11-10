# Guía de desarrollo asistido — AMER Pólizas

De un prototipo visual en React a un producto con backend en Django Ninja, especificado con
OpenSpec, construido con Claude Code y verificado con pruebas unitarias y funcionales.

> **Léela una vez completa antes de teclear nada.** El orden importa: cada paso deja preparado
> el contexto que necesita el siguiente.

---

## Índice

0. [Punto de partida y prerrequisitos](#0-punto-de-partida-y-prerrequisitos)
1. [Paso 1 — Repositorio propio y primer push](#paso-1--repositorio-propio-y-primer-push)
2. [Paso 2 — Congelar el diseño existente (antes de desarrollar)](#paso-2--congelar-el-diseño-existente-antes-de-desarrollar)
3. [Paso 3 — Instalar e inicializar OpenSpec](#paso-3--instalar-e-inicializar-openspec)
4. [Paso 4 — Iniciar Claude Code en el proyecto](#paso-4--iniciar-claude-code-en-el-proyecto)
5. [Paso 5 — Buenas prácticas: CLAUDE.md y skills](#paso-5--buenas-prácticas-claudemd-y-skills)
6. [Paso 6 — De la HU al cambio de OpenSpec](#paso-6--de-la-hu-al-cambio-de-openspec)
7. [Paso 7 — Implementar con el agente](#paso-7--implementar-con-el-agente)
8. [Paso 8 — Backend Django Ninja y base de datos](#paso-8--backend-django-ninja-y-base-de-datos)
9. [Paso 9 — Pruebas: unitarias y funcionales con Playwright](#paso-9--pruebas-unitarias-y-funcionales-con-playwright)
10. [Paso 10 — Ramas, PR y cierre de épica](#paso-10--ramas-pr-y-cierre-de-épica)
11. [Anexos: comandos, errores frecuentes](#anexo-a--comandos-de-consulta-rápida)

---

## 0. Punto de partida y prerrequisitos

Lo que ya hay en la carpeta:

```
amerpolizasapp/
├── app/            # prototipo React 19 + TypeScript + Vite (sólo frontend, con datos simulados)
├── docs/
│   ├── hu/         # 30 historias de usuario derivadas del prototipo
│   ├── backlog/    # épicas priorizadas
│   ├── guias/      # esta guía y la biblioteca de prompts
│   ├── DESIGN-SYSTEM.md
│   └── DATOS.md
└── .claude/skills/ # 7 skills de buenas prácticas
```

Lo que hay que tener instalado:

| Herramienta | Versión mínima | Verificación |
|---|---|---|
| Node.js | 20.19 | `node --version` |
| Python | 3.12 | `python --version` |
| Git | 2.40 | `git --version` |
| GitHub CLI | 2.x | `gh --version` |
| Claude Code | última | `claude --version` |
| Docker Desktop (opcional, para PostgreSQL) | — | `docker --version` |

Comprobación de que el prototipo corre:

```bash
cd app
npm install
npm run dev        # http://localhost:5173
```

---

## Paso 1 — Repositorio propio y primer push

### 1.1 Preparar el repositorio local

```bash
cd amerpolizasapp
git init -b main

# .gitignore de la raíz
cat > .gitignore <<'GIT'
node_modules/
dist/
.venv/
__pycache__/
*.py[cod]
.env
*.sqlite3
e2e/evidencia/artifacts/
e2e/evidencia/reporte/
playwright-report/
test-results/
.DS_Store
GIT

git add .
git commit -m "chore: prototipo React, HU, backlog, guías y skills iniciales"
```

### 1.2 Crear el repositorio remoto (personal)

```bash
gh auth login                      # elige GitHub.com → HTTPS → autenticar en el navegador
gh repo create amer-polizas --private --source=. --remote=origin --push
```

Sin GitHub CLI: crea el repositorio vacío en github.com y luego

```bash
git remote add origin https://github.com/<tu-usuario>/amer-polizas.git
git push -u origin main
```

### 1.3 Ramas base

```bash
git switch -c develop
git push -u origin develop
```

`main` queda para versiones estables; el trabajo diario ocurre en `develop` y sus ramas hijas.

> **Cómo se lo pides al agente** (prompt listo en `PROMPTS.md` → *P1 Repositorio*):
> «Antes de empezar la épica E0, prepara Git: verifica que estemos en `develop`, crea la rama
> `epica/E0-fundacion-acceso` y, dentro de ella, `feat/HU-001-autenticacion`. Sigue la skill
> `flujo-git-agente`. No hagas push a `main` en ningún caso.»

---

## Paso 2 — Congelar el diseño existente (antes de desarrollar)

Este paso es lo que evita que el producto termine pareciendo cuatro aplicaciones distintas. La
parte visual ya está construida: es el contrato, no una sugerencia.

### 2.1 El documento del sistema de diseño

`docs/DESIGN-SYSTEM.md` ya contiene el inventario: tokens de color, tipografía, estructura de
página, clases disponibles, componentes reutilizables y reglas de construcción. **Léelo tú
primero**, porque es lo que vas a exigirle al agente.

### 2.2 Verificar que el inventario sigue vigente

Cuando el frontend cambie, se actualiza el documento. Prompt:

> «Revisa `app/src/styles/global.css` y `app/src/components/ui/`. Compara con
> `docs/DESIGN-SYSTEM.md` y actualiza el inventario de clases y componentes si hay diferencias.
> No cambies el CSS: sólo documenta lo que existe.»

### 2.3 Pantallas nuevas a partir de lo existente: el caso del login

El prototipo **no tiene login** y el sistema lo necesita (HU-001). Es el primer ejercicio de
"crear respetando el diseño". La instrucción al agente nunca es "hazme un login bonito", sino:

> «Vas a crear la pantalla de login de HU-001.
> 1. Lee `docs/DESIGN-SYSTEM.md` y la skill `diseno-amer`.
> 2. Antes de escribir código, dime qué clases existentes de `global.css` vas a usar y qué
>    pantalla tomaste como referencia.
> 3. Reutiliza el degradado de `.side` para el panel izquierdo y el logo
>    `public/assets/amer-logo-white.png`.
> 4. El formulario usa `.card`, `.fgrid`, `.field`, `.lbl`, `.inp` y `.btn.btn-pri`. Sin colores
>    literales: sólo variables CSS.
> 5. Agrega `data-testid` a correo, contraseña, botón de ingreso y mensaje de error.
> Espera mi visto bueno a la lista de clases antes de implementar.»

Esa pausa —enumerar las clases antes de codificar— es la que mantiene la coherencia visual.

### 2.4 Regla permanente

Toda HU que agregue pantalla incluye en su `design.md` una sección **"Reutilización visual"** con
las clases y componentes existentes que se van a usar. Si el agente propone CSS nuevo, debe
justificar por qué ninguna clase existente sirve.

---

## Paso 3 — Instalar e inicializar OpenSpec

OpenSpec mantiene un contrato escrito entre lo que se pide y lo que el agente construye:
propuesta → especificación → diseño → tareas → implementación → archivo.

### 3.1 Instalación (una vez por máquina)

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Requiere Node 20.19 o superior.

### 3.2 Inicialización (una vez por proyecto)

```bash
cd amerpolizasapp
openspec init --tools claude
```

Para varias herramientas: `openspec init --tools claude,opencode,cursor`.

Crea:

```
openspec/
├── specs/       # el comportamiento actual del sistema (fuente de verdad, crece con el tiempo)
├── changes/     # los cambios en curso, uno por carpeta
└── config.yaml
.claude/skills/  # las skills de OpenSpec, junto a las nuestras
```

> **Importante.** `openspec/specs/` empieza casi vacío y **así debe ser**. No se documenta el
> sistema entero antes de empezar: cada cambio archivado va aportando la porción de spec que tocó.

### 3.3 Activar el flujo ampliado (necesario para `/opsx:new`)

El perfil por defecto (`core`) instala `/opsx:explore`, `/opsx:propose`, `/opsx:apply`,
`/opsx:update`, `/opsx:sync` y `/opsx:archive`. Para trabajar artefacto por artefacto —que es lo
que conviene cuando se parte de HU— hacen falta `/opsx:new`, `/opsx:continue`, `/opsx:ff` y
`/opsx:verify`:

```bash
openspec config profile     # elegir "Change workflows" y marcar new, continue, ff, verify
openspec update             # aplica la selección a este proyecto
```

Verificación: en Claude Code, escribe `/opsx:` y deben aparecer los comandos nuevos.

### 3.4 Los dos tipos de comando (fuente clásica de confusión)

| Dónde se escribe | Ejemplos | Qué hace |
|---|---|---|
| **Terminal** | `openspec init`, `openspec list`, `openspec validate`, `openspec archive` | Administra archivos y valida |
| **Chat de Claude** | `/opsx:new`, `/opsx:continue`, `/opsx:apply`, `/opsx:verify` | Le pide al agente que produzca o ejecute |

---

## Paso 4 — Iniciar Claude Code en el proyecto

```bash
cd amerpolizasapp
claude
```

Primera sesión, en este orden:

1. `/status` — confirma modelo y carpeta del proyecto.
2. `/init` — genera un `CLAUDE.md` inicial leyendo el repositorio.
3. Ajusta ese `CLAUDE.md` con el contenido del paso 5.
4. Prompt de orientación:

> «Lee `docs/hu/README.md`, `docs/backlog/BACKLOG.md`, `docs/DESIGN-SYSTEM.md` y las skills de
> `.claude/skills/`. Resúmeme en diez líneas qué es este proyecto, en qué estado está y cuál es
> la primera épica. No escribas código todavía.»

Ese resumen te dice si el agente entendió el contexto. Si se equivoca, corrígelo ahí: sale mucho
más barato que corregirlo después sobre el código.

---

## Paso 5 — Buenas prácticas: `CLAUDE.md` y skills

### 5.1 Dónde vive cada cosa

| Archivo | Alcance | Contenido |
|---|---|---|
| `CLAUDE.md` (raíz) | Siempre en contexto | Reglas cortas e innegociables del proyecto |
| `.claude/skills/<nombre>/SKILL.md` | Se carga cuando aplica | Guías detalladas por tema |
| `docs/` | Se lee cuando se cita | HU, backlog, sistema de diseño |

Las skills ya están creadas en `.claude/skills/`:

| Skill | Cuándo la usa el agente |
|---|---|
| `diseno-amer` | Al crear o cambiar cualquier pantalla o estilo |
| `backend-django-ninja` | Al crear modelos, esquemas, endpoints o servicios |
| `pruebas-unitarias` | Al implementar lógica y antes de cerrar una tarea |
| `pruebas-e2e-playwright` | Al cerrar una feature o épica, y ante cambios de interfaz |
| `gate-de-entrega` | Antes de marcar algo como terminado, hacer commit o abrir PR |
| `flujo-git-agente` | Al crear ramas, hacer commits y abrir PR |
| `datos-y-migraciones` | Al tocar modelos, migraciones o datos semilla |

Se listan con `/skills` dentro de Claude Code.

### 5.2 `CLAUDE.md` recomendado

```markdown
# AMER Pólizas — reglas del proyecto

## Contexto
Sistema de gestión de pólizas para una agencia de seguros colombiana.
Frontend React 19 + TypeScript + Vite en `app/`. Backend Django + Django Ninja en `api/`.
Las historias de usuario están en `docs/hu/`, el backlog en `docs/backlog/BACKLOG.md`.

## Reglas innegociables
1. El diseño no se inventa: se reutiliza. Ver `docs/DESIGN-SYSTEM.md` y la skill `diseno-amer`.
2. Toda funcionalidad nace de una HU y de un cambio de OpenSpec. Si no hay spec, no hay código.
3. La lógica de negocio vive en el backend (`services.py`), no en los componentes de React.
4. Nada se marca como terminado sin pasar la skill `gate-de-entrega`.
5. Cada `#### Scenario` de una spec tiene su prueba de Playwright.
6. Dinero con `Decimal`, nunca `float`. Moneda en pesos colombianos.
7. Ningún dato personal real entra al repositorio (`docs/DATOS.md`).
8. Interfaz y nombres de dominio en español.
9. No se instalan librerías de UI nuevas.
10. `git push --force`, cambios en `main` y merges de PR requieren mi confirmación explícita.

## Comandos
- Frontend: `cd app && npm run dev | npm run test:unit | npm run lint`
- Backend: `cd api && python manage.py runserver | pytest -q | ruff check .`
- E2E: `npx playwright test` · regresión: `npx playwright test --grep @regresion`
```

### 5.3 Cuándo crear una skill nueva

Cuando una instrucción se repite en tres conversaciones distintas, deja de ser un prompt y pasa a
ser una skill. Se le pide al propio agente:

> «Crea una skill en `.claude/skills/<nombre>/SKILL.md` con el frontmatter `name` y `description`
> siguiendo el estilo de las existentes, que recoja estas reglas: …»

---

## Paso 6 — De la HU al cambio de OpenSpec

Este es el corazón del método. Se hace **una HU a la vez**.

### 6.1 Explorar (opcional pero recomendado la primera vez)

```
/opsx:explore
```

> «Voy a implementar HU-001 (autenticación). Revisa `app/src/App.tsx`,
> `app/src/components/layout/` y dime cómo está resuelta hoy la navegación y qué haría falta
> para proteger las rutas. No propongas cambios todavía.»

### 6.2 Abrir el cambio

```
/opsx:new hu-001-autenticacion
```

Crea `openspec/changes/hu-001-autenticacion/` y espera instrucciones. El nombre del cambio
siempre lleva el identificador de la HU: así se rastrea desde el commit hasta la prueba.

### 6.3 El brief: convertir la HU en intención

La HU es el brief. Se le entrega tal cual:

> «El brief de este cambio es `docs/hu/HU-001-autenticacion.md`. Léelo completo, junto con
> `docs/DESIGN-SYSTEM.md` y la skill `diseno-amer`. Antes de escribir la propuesta, dime en
> cinco líneas qué entendiste y qué decisiones técnicas quedan abiertas.»

### 6.4 Generar los artefactos, uno a uno

```
/opsx:continue          # 1) proposal.md   → el porqué y el alcance
/opsx:continue          # 2) specs/…       → el qué, en requisitos y escenarios
/opsx:continue          # 3) design.md     → el cómo técnico
/opsx:continue          # 4) tasks.md      → el plan de trabajo verificable
```

Cadena de dependencias: `proposal → specs → design → tasks`. **Se revisa cada artefacto antes de
pedir el siguiente.** Aquí es donde se corrige el rumbo barato.

Si el alcance es evidente y no hace falta revisar paso a paso: `/opsx:ff` genera los cuatro de una vez.

### 6.5 Qué revisar en la especificación

Formato que exige OpenSpec (si no se cumple, la validación falla o —peor— el requisito se ignora
en silencio):

```markdown
## ADDED Requirements

### Requirement: Ingreso con credenciales válidas
El sistema SHALL autenticar a un usuario activo con correo y contraseña correctos y
devolver un token de sesión.

#### Scenario: Credenciales correctas
- **WHEN** un usuario activo envía correo y contraseña válidos
- **THEN** el sistema devuelve un token y redirige al tablero
```

Lista de revisión:

- [ ] Cada criterio de aceptación de la HU aparece como un `#### Scenario` (cuatro almohadillas, exactamente).
- [ ] Los requisitos usan **SHALL**, no "debería".
- [ ] Todo requisito tiene al menos un escenario.
- [ ] Los escenarios describen **comportamiento observable**, no implementación.
- [ ] Las capacidades nuevas abren con `## Purpose`.
- [ ] No hay escenarios inventados que no estén en la HU (o si los hay, se discuten y se agregan a la HU).

Validación en la terminal:

```bash
openspec validate --strict
openspec list                # cambios en curso
openspec list --specs        # capacidades ya documentadas
```

### 6.6 Ajustar sin rehacer

```
/opsx:update hu-001-autenticacion
```

> «En la spec, el escenario de bloqueo por intentos fallidos debe decir 5 intentos y 15 minutos,
> no 3 y 5. Ajusta también las tareas que dependan de eso.»

---

## Paso 7 — Implementar con el agente

```
/opsx:apply hu-001-autenticacion
```

El agente recorre `tasks.md`, escribe código y va marcando las tareas. Cómo se conduce:

**Al arrancar**

> «Antes de implementar: aplica las skills `diseno-amer`, `backend-django-ninja` y
> `pruebas-unitarias`. Trabaja tarea por tarea; al terminar cada una, ejecuta sus pruebas y
> muéstrame el resultado antes de seguir con la siguiente.»

**Al revisar el código contra la especificación**

> «Toma `openspec/changes/hu-001-autenticacion/specs/` y, para cada `#### Scenario`, dime en qué
> archivo y línea queda cubierto y con qué prueba. Si alguno no está cubierto, no lo justifiques:
> impleméntalo.»

**Cuando se desvía**

> «Te saliste de la spec: agregaste recuperación de contraseña, que no está en HU-001. Revierte
> ese cambio. Si crees que hace falta, lo proponemos como HU nueva.»

**Verificación formal**

```
/opsx:verify hu-001-autenticacion
```

Contrasta implementación contra artefactos en tres ejes: completitud, corrección y coherencia.

**Cierre**

```
/opsx:archive hu-001-autenticacion
```

Mezcla las specs delta en `openspec/specs/` y archiva el cambio. A partir de ahí, esa capacidad
es parte del comportamiento documentado del sistema.

---

## Paso 8 — Backend Django Ninja y base de datos

### 8.1 Arranque del backend (una sola vez, dentro de la épica E0)

Prompt:

> «Crea el backend siguiendo la skill `backend-django-ninja`: proyecto Django en `api/` con
> Django Ninja, `config/settings/{base,dev,prod}.py`, apps `core`, `usuarios`, `catalogos`,
> `clientes`, `polizas` y `comisiones`, dependencias con `uv`, `ruff` configurado, `pytest` con
> `pytest-django`, y `docker-compose.yml` con PostgreSQL 16 para desarrollo. Sin lógica de
> negocio todavía: sólo el esqueleto que arranca y responde en `/api/docs`.»

Comandos resultantes:

```bash
cd api
uv sync
cp .env.example .env
docker compose up -d db
python manage.py migrate
python manage.py runserver     # http://localhost:8000/api/docs
```

### 8.2 "Subir la base de datos" — qué significa realmente

No se sube el archivo de la base de datos. Se versiona lo que permite reconstruirla: **modelos,
migraciones y datos semilla**. Ver la skill `datos-y-migraciones`.

Prompt:

> «Crea el comando `python manage.py seed` en `apps/core/management/commands/seed.py` que cargue
> en la base de datos los catálogos y los datos de demostración de
> `app/src/data/mockData.ts` (ya anonimizados): sedes, aseguradoras, ramos, coberturas, motivos,
> estados de siniestro, tipos de afiliación, un usuario por rol, los 12 clientes y las 12 pólizas.
> Debe ser idempotente y aceptar `--limpiar`. Súbelo con sus migraciones. No versiones ningún
> archivo `.sqlite3` ni volcados `.sql`.»

Y para el push:

> «Haz commit de los modelos, las migraciones y el comando `seed` con el formato de la skill
> `flujo-git-agente`, y súbelo a la rama de la épica. Antes de hacer push, verifica con
> `git status` que no se esté subiendo `.env`, la base de datos ni `node_modules`.»

### 8.3 Conectar el frontend al backend

> «Reemplaza los imports de `app/src/data/mockData.ts` por llamadas al API. Crea
> `app/src/api/client.ts` con la URL base desde `import.meta.env.VITE_API_URL`, manejo del token
> y de errores 401/403. Cambia una pantalla a la vez, empezando por Aseguradoras, y deja el resto
> funcionando con datos simulados hasta que le toque su épica.»

---

## Paso 9 — Pruebas: unitarias y funcionales con Playwright

### 9.1 Instalación (una vez)

```bash
cd amerpolizasapp
npm init -y                       # sólo si no existe package.json en la raíz
npm i -D @playwright/test
npx playwright install chromium
```

En `app/`, para las unitarias del frontend:

```bash
cd app
npm i -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### 9.2 Configuración con evidencia

`playwright.config.ts` en la raíz:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/specs',
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { outputFolder: 'e2e/evidencia/reporte', open: 'never' }]],
  outputDir: 'e2e/evidencia/artifacts',
  use: {
    baseURL: 'http://localhost:5173',
    video: 'on',                    // video de todas las pruebas
    screenshot: 'on',               // captura al final de cada prueba
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    { command: 'npm --prefix app run dev', url: 'http://localhost:5173', reuseExistingServer: true },
    { command: 'python api/manage.py runserver', url: 'http://localhost:8000/api/docs', reuseExistingServer: true },
  ],
});
```

### 9.3 Generar las pruebas desde la especificación

Este es el prompt clave, y se ejecuta **al cerrar cada feature**:

> «Toma `openspec/changes/hu-012-listar-polizas/specs/` y genera
> `e2e/specs/hu-012-listar-polizas.spec.ts` siguiendo la skill `pruebas-e2e-playwright`:
> un `test()` por cada `#### Scenario`, titulado con el identificador del criterio, selectores
> por `data-testid` o rol, sin `waitForTimeout`, con captura al final de cada prueba.
> Marca con `@regresion` los escenarios estables. Si un elemento no tiene `data-testid`,
> agrégaselo al componente en lugar de usar selectores frágiles. Luego ejecútalas y muéstrame el
> resultado.»

### 9.4 Cuándo se ejecuta cada cosa

| Momento | Qué se corre |
|---|---|
| Al terminar una tarea | `ruff check` + `pytest -q` + `npm run test:unit` |
| Al terminar una HU | Lo anterior + `npx playwright test e2e/specs/hu-XXX-*.spec.ts` |
| Al cerrar una épica | Todo lo anterior + **regresión completa** `npx playwright test` + cobertura + evidencia |
| En cada push | Todo, en CI |

Instrucción permanente al agente (ya está en `CLAUDE.md` y en la skill `gate-de-entrega`):

> «Cuando termines una feature o una épica, no me digas que está lista: ejecuta las pruebas
> unitarias y las funcionales de Playwright, corre además la suite de regresión completa, y
> muéstrame una tabla con pruebas ejecutadas, pasadas, falladas, cobertura y la ruta de los
> videos y capturas. Si algo falla, corrígelo antes de reportar.»

### 9.5 Regresión

La suite crece con el producto: lo que se probó en la épica 3 se sigue ejecutando en la 9. Es
justamente lo que detecta que la nueva liquidación rompió el listado.

```bash
npx playwright test --grep @regresion      # rápida, en cada feature
npx playwright test                        # completa, al cerrar épica
npx playwright show-report e2e/evidencia/reporte
```

### 9.6 Integración continua

> «Crea `.github/workflows/ci.yml` que en cada push y PR: instale dependencias de `api/` y `app/`,
> corra `ruff check`, `pytest --cov`, `npm run lint`, `npm run test:unit` y
> `npx playwright test`, y publique el reporte HTML de Playwright y los videos como artefactos
> del workflow.»

---

## Paso 10 — Ramas, PR y cierre de épica

```bash
# al empezar la épica
git switch develop && git pull --rebase
git switch -c epica/E0-fundacion-acceso

# por cada HU
git switch -c feat/HU-001-autenticacion
# … trabajo, commits …
git push -u origin feat/HU-001-autenticacion
gh pr create --base epica/E0-fundacion-acceso --fill

# al cerrar la épica
gh pr create --base develop --title "E0 — Fundación y acceso" --body-file .github/PR_EPICA.md
```

Checklist de cierre (skill `gate-de-entrega`, nivel 3):

- [ ] Todas las HU de la épica archivadas en OpenSpec.
- [ ] `openspec validate --strict` sin errores.
- [ ] `pytest --cov` ≥ 80 % en lo nuevo.
- [ ] Regresión de Playwright completa en verde.
- [ ] Evidencia (videos y capturas) enlazada en el PR.
- [ ] Entregable interactivo demostrado según `docs/backlog/BACKLOG.md`.

---

## Anexo A — Comandos de consulta rápida

### OpenSpec (terminal)

| Comando | Para qué |
|---|---|
| `openspec init --tools claude` | Inicializar en el proyecto |
| `openspec update` | Regenerar comandos tras cambiar de perfil o actualizar el CLI |
| `openspec config profile` | Elegir qué flujos de trabajo se instalan |
| `openspec list` | Cambios en curso |
| `openspec list --specs` | Capacidades ya especificadas |
| `openspec show "<id>" --type spec` | Ver una spec completa |
| `openspec validate --strict` | Validar formato de los cambios |
| `openspec status` | Estado de artefactos de un cambio |
| `openspec archive <cambio>` | Archivar y mezclar specs |

### OpenSpec (chat)

| Comando | Para qué |
|---|---|
| `/opsx:explore` | Investigar antes de proponer |
| `/opsx:new <nombre>` | Abrir el cambio |
| `/opsx:continue` | Crear el siguiente artefacto |
| `/opsx:ff` | Crear todos los artefactos de una vez |
| `/opsx:apply <cambio>` | Implementar las tareas |
| `/opsx:verify <cambio>` | Contrastar implementación contra spec |
| `/opsx:update <cambio>` | Ajustar artefactos existentes |
| `/opsx:archive <cambio>` | Cerrar el cambio |

### Proyecto

```bash
cd app && npm run dev            # frontend
cd api && python manage.py runserver   # backend
cd api && pytest -q --cov=apps         # unitarias backend
cd app && npm run test:unit            # unitarias frontend
npx playwright test                    # funcionales
npx playwright test --ui               # depurar
npx playwright codegen http://localhost:5173   # grabar una prueba
```

---

## Anexo B — Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| `/opsx:new` no existe en el chat | Perfil `core` | `openspec config profile` → activar los flujos ampliados → `openspec update` |
| `openspec: command not found` | Instalación global sin PATH | Reabrir la terminal; verificar `npm bin -g` |
| `openspec validate` marca cero deltas | El cambio no tiene specs | Escribir la spec, o declarar `skip_specs: true` sólo si de verdad no cambia comportamiento |
| Un escenario no se aplica y nadie avisa | Se escribió `### Scenario` con tres almohadillas | Deben ser **cuatro**: `#### Scenario:` |
| El agente reescribe estilos | No leyó el sistema de diseño | Recordarle la skill `diseno-amer` y exigir la lista de clases antes de codificar |
| Playwright no encuentra un elemento | Selector por clase CSS | Agregar `data-testid` al componente |
| Las pruebas pasan en local y fallan en CI | Datos no sembrados | Ejecutar `python manage.py seed` en el workflow antes de las E2E |
| Se subió un `.env` | Falta en `.gitignore` | Rotar credenciales y limpiar el historial; no basta con borrarlo en un commit nuevo |
