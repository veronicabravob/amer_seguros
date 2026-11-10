---
name: datos-y-migraciones
description: Cómo se maneja la base de datos del proyecto AMER Pólizas — modelos, migraciones de Django, datos semilla derivados del prototipo, y qué se versiona y qué no. Úsala al crear o cambiar modelos, al preparar datos de prueba y cuando se pida "subir la base de datos" al repositorio.
---

# Base de datos, migraciones y datos semilla

## Qué significa "subir la base de datos" en este proyecto

**No** se sube el archivo de la base de datos. Se versiona lo que permite **reconstruirla**:

1. **Modelos** (`apps/*/models.py`) — la estructura.
2. **Migraciones** (`apps/*/migrations/`) — la historia de cambios. Se versionan siempre.
3. **Datos semilla** (`apps/core/management/commands/seed.py`) — catálogos y datos de demostración
   anonimizados, derivados de `app/src/data/mockData.ts`.
4. **Compose de desarrollo** (`docker-compose.yml`) — PostgreSQL local con credenciales de ejemplo.

Con eso, cualquiera clona y levanta:

```bash
docker compose up -d db
cd api
python manage.py migrate
python manage.py seed          # catálogos + datos de demo anonimizados
python manage.py createsuperuser
python manage.py runserver
```

## Reglas de migraciones

- Una migración por cambio de modelo, con nombre descriptivo:
  `python manage.py makemigrations polizas -n agrega_beneficiario_oneroso`.
- Nunca se edita una migración ya mezclada a `develop`: se crea una nueva.
- Los cambios que borran o renombran columnas llevan migración de datos, no sólo de esquema.
- Antes de cerrar la tarea: `python manage.py makemigrations --check --dry-run` sin cambios pendientes.

## Datos semilla

- El comando `seed` es **idempotente**: se puede correr varias veces sin duplicar.
- Contenido: sedes, aseguradoras, ramos, coberturas, motivos, estados de siniestro, tipos de
  afiliación, 3 usuarios (uno por rol), 12 clientes y 12 pólizas — los mismos del prototipo,
  ya anonimizados.
- Las pruebas E2E se apoyan en este seed; si cambia, se revisan las pruebas que dependen de él.
- `python manage.py seed --limpiar` reinicia los datos de demo sin tocar la estructura.

## Nunca

- Volcados de producción en el repositorio.
- Datos personales reales en fixtures, pruebas o capturas.
- Credenciales reales en `settings` o en `docker-compose.yml`: van en `.env` (con `.env.example` versionado).
