# Biblioteca de prompts — AMER Pólizas

Prompts listos para copiar y pegar en Claude Code, en el orden en que se usan.
Sustituye lo que va entre `< >`.

---

## P0 · Orientación (primera sesión)

```
Lee docs/hu/README.md, docs/backlog/BACKLOG.md, docs/DESIGN-SYSTEM.md, docs/DATOS.md y las
skills de .claude/skills/. Resúmeme en diez líneas qué es este proyecto, en qué estado está,
cuál es la primera épica y qué necesitas de mí antes de empezar. No escribas código todavía.
```

---

## P1 · Repositorio y ramas

```
Prepara el trabajo de la épica <E0 — Fundación y acceso> siguiendo la skill flujo-git-agente:
1. Verifica el estado del repositorio y en qué rama estamos.
2. Confirma que .gitignore cubre .env, node_modules, .venv, __pycache__, *.sqlite3 y la
   evidencia de pruebas.
3. Crea la rama epica/<E0-fundacion-acceso> desde develop y, dentro, feat/<HU-001-autenticacion>.
Nunca hagas push a main ni uses --force sin pedirme confirmación.
```

```
Sube lo que llevamos: haz commits atómicos con el formato <tipo>(HU-XXX): <descripción>,
verifica con git status que no se cuele ningún secreto ni la base de datos, haz push de la rama
y abre el PR hacia la rama de la épica con gh pr create, describiendo HU cubiertas, escenarios
verificados y resultado de las pruebas.
```

---

## P2 · Diseño (antes de cualquier pantalla)

```
Vas a crear <la pantalla de login de HU-001>.
1. Lee docs/DESIGN-SYSTEM.md y la skill diseno-amer.
2. Antes de escribir código, dime qué pantalla existente tomas como referencia y qué clases de
   global.css vas a usar.
3. No introduzcas librerías de UI ni colores literales: sólo variables CSS.
4. Agrega data-testid a los elementos con los que interactuarán las pruebas.
Espera mi visto bueno a esa lista antes de implementar.
```

```
Revisa app/src/styles/global.css y app/src/components/ui/, compáralos con docs/DESIGN-SYSTEM.md
y actualiza el inventario si hay diferencias. No modifiques el CSS: sólo documenta lo que existe.
```

---

## P3 · De la HU al cambio de OpenSpec

```
/opsx:explore
Voy a implementar <HU-012 — Listar pólizas>. Revisa <app/src/pages/polizas/PolizasListPage.tsx>
y dime cómo está resuelto hoy y qué haría falta para conectarlo al API. No propongas cambios aún.
```

```
/opsx:new <hu-012-listar-polizas>
```

```
El brief de este cambio es docs/hu/<HU-012-listar-polizas.md>. Léelo completo junto con
docs/DESIGN-SYSTEM.md y las skills diseno-amer y backend-django-ninja. Antes de escribir la
propuesta, dime en cinco líneas qué entendiste y qué decisiones técnicas quedan abiertas.
```

```
/opsx:continue
Genera la propuesta a partir del brief. El alcance es exactamente el de la HU: ni un criterio
menos, ni una funcionalidad de más. Si crees que falta algo, dímelo en vez de agregarlo.
```

```
/opsx:continue
Escribe las specs. Cada criterio de aceptación de la HU debe quedar como un #### Scenario con
cuatro almohadillas, en formato WHEN/THEN, con requisitos en SHALL y comportamiento observable
(nada de nombres de clases ni de funciones).
```

```
Revisa la spec que acabas de escribir contra docs/hu/<HU-012-listar-polizas.md> y muéstrame una
tabla: criterio de la HU → escenario de la spec. Marca los que falten o los que hayas agregado
por tu cuenta.
```

---

## P4 · Implementación

```
/opsx:apply <hu-012-listar-polizas>
Antes de empezar, aplica las skills diseno-amer, backend-django-ninja y pruebas-unitarias.
Trabaja tarea por tarea: al terminar cada una ejecuta sus pruebas y muéstrame el resultado
antes de pasar a la siguiente.
```

```
Toma openspec/changes/<hu-012-listar-polizas>/specs/ y, para cada #### Scenario, dime en qué
archivo y línea queda cubierto y con qué prueba. Si alguno no está cubierto, impleméntalo.
```

```
Te saliste de la especificación: <agregaste exportación a PDF, que no está en la HU>. Revierte
ese cambio. Si crees que hace falta, lo proponemos como HU nueva en el backlog.
```

```
/opsx:verify <hu-012-listar-polizas>
```

```
/opsx:archive <hu-012-listar-polizas>
```

---

## P5 · Backend Django Ninja

```
Crea el backend siguiendo la skill backend-django-ninja: proyecto Django en api/ con Django
Ninja, config/settings/{base,dev,prod}.py, apps core, usuarios, catalogos, clientes, polizas y
comisiones, dependencias con uv, ruff, pytest con pytest-django, y docker-compose.yml con
PostgreSQL 16. Sin lógica de negocio: sólo el esqueleto que arranca y responde en /api/docs.
```

```
Implementa el módulo <catalogos> según la spec del cambio <hu-004-aseguradoras>:
modelos, migraciones, esquemas de entrada y salida, servicios con la lógica y router montado en
/api/aseguradoras. La lógica va en services.py, no en el endpoint. Dinero con Decimal.
Todas las consultas filtran por la agencia del usuario autenticado.
```

```
Crea el comando python manage.py seed en apps/core/management/commands/seed.py que cargue los
catálogos y los datos de demostración de app/src/data/mockData.ts (ya anonimizados): sedes,
aseguradoras, ramos, coberturas, motivos, estados de siniestro, tipos de afiliación, un usuario
por rol, los 12 clientes y las 12 pólizas. Idempotente y con opción --limpiar. Versiona modelos,
migraciones y el comando; no versiones ningún .sqlite3 ni volcado .sql.
```

```
Reemplaza los imports de app/src/data/mockData.ts por llamadas al API. Crea app/src/api/client.ts
con la URL base desde import.meta.env.VITE_API_URL, manejo del token y de errores 401/403.
Cambia una pantalla a la vez, empezando por <Aseguradoras>; el resto sigue con datos simulados
hasta que le toque su épica.
```

---

## P6 · Pruebas

```
Configura Playwright en la raíz siguiendo la skill pruebas-e2e-playwright: testDir e2e/specs,
video 'on', screenshot 'on', trace 'retain-on-failure', reporte HTML en e2e/evidencia/reporte y
webServer que levante el frontend y el backend. Instala sólo chromium.
```

```
Toma openspec/changes/<hu-012-listar-polizas>/specs/ y genera
e2e/specs/<hu-012-listar-polizas>.spec.ts según la skill pruebas-e2e-playwright: un test() por
cada #### Scenario, titulado con el identificador del criterio, selectores por data-testid o rol,
sin waitForTimeout, con captura al final. Marca con @regresion los escenarios estables. Si un
elemento no tiene data-testid, agrégaselo al componente. Luego ejecútalas y muéstrame el resultado.
```

```
Escribe las pruebas unitarias de <el cálculo de prima, IVA y comisión (HU-015)> según la skill
pruebas-unitarias: casos de borde obligatorios (cero, negativo, redondeo, IVA 0 %, retenciones
combinadas), nombres que citen la HU y el criterio, datos con factory_boy y Faker es_CO.
Exijo 100 % de ramas en este módulo.
```

```
Terminé la feature <HU-012>. Aplica la skill gate-de-entrega nivel 2: corre lint, pruebas
unitarias de backend y frontend, y las E2E de esta HU. Muéstrame una tabla con ejecutadas,
pasadas, falladas y la ruta de la evidencia. Si algo falla, corrígelo antes de reportar.
```

```
Vamos a cerrar la épica <E4 — Pólizas, consulta>. Aplica la skill gate-de-entrega nivel 3:
regresión completa de Playwright, cobertura con pytest --cov, verificación de que cada escenario
de las specs archivadas tiene su prueba, y evidencia en e2e/evidencia/. Reporta en tabla y dime
qué quedó pendiente, si algo.
```

---

## P7 · Integración continua

```
Crea .github/workflows/ci.yml que en cada push y PR instale dependencias de api/ y app/, corra
ruff check, pytest --cov, npm run lint, npm run test:unit y npx playwright test, siembre la base
de datos con manage.py seed antes de las E2E, y publique el reporte HTML de Playwright y los
videos como artefactos del workflow.
```

---

## P8 · Cuando el agente se desvía

```
Detente. Antes de seguir, dime: ¿qué escenario de la spec estás implementando ahora mismo?
Si lo que estás haciendo no corresponde a ninguno, revierte y volvemos al plan.
```

```
No modifiques <app/src/styles/global.css> agregando clases nuevas sin justificarlo. Muéstrame qué
clase existente no te sirve y por qué, y decidimos juntos.
```

```
Estás marcando tareas como completas sin ejecutar pruebas. Aplica la skill gate-de-entrega:
ninguna tarea se marca sin su verificación ejecutada y mostrada.
```
