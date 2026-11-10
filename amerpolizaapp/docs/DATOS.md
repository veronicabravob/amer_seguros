# Datos de demostración

El prototipo se alimenta de `app/src/data/mockData.ts`. **Esos datos fueron anonimizados**
el 11 de septiembre de 2026 antes de publicar el proyecto en un repositorio.

## Qué se cambió

| Campo | Tratamiento |
|---|---|
| Cédulas y NIT de clientes y vendedores | Reemplazados por identificadores ficticios con formato colombiano válido |
| Teléfonos de clientes y sedes | Reemplazados por una serie ficticia (`+57 310 200 11xx`, `+57 (608) 700 100x`) |
| Correos personales (gmail/hotmail y dominios de clientes) | Reemplazados por dominios ficticios |
| Nombres de personas naturales (clientes y vendedores) | Reemplazados por nombres ficticios |
| Razones sociales reconocibles de clientes | Reemplazadas por razones sociales ficticias |
| Direcciones de las sedes | Reemplazadas por direcciones ficticias en las mismas ciudades |
| NIT del beneficiario oneroso en `helpers.ts` | Reemplazado; el banco es ficticio |

Se conservaron a propósito: nombres y NIT de **aseguradoras** (son personas jurídicas públicas y
dan realismo al catálogo), ciudades, ramos, coberturas y todos los valores monetarios.

## Cuentas de demostración (HU-001)

`cd api && python manage.py seed` crea estas cuentas. **Son ficticias**: no corresponden a
ninguna persona real y sólo sirven para desarrollo, demostración y pruebas E2E. El comando se
niega a ejecutarse con la configuración de producción.

| Correo | Nombre | Rol | Sede | Estado |
|---|---|---|---|---|
| `laura.gomez@amerseguros.com` | Laura Gómez | Administrador | Duitama | Activo |
| `carlos.rincon@amerseguros.com` | Carlos Rincón | Asesor comercial | Tunja | Activo |
| `julian.castro@amerseguros.com` | Julián Castro | Cobros | Duitama | Activo |
| `paula.ruiz@amerseguros.com` | Paula Ruiz | Recepción | Duitama | **Inactivo** |

Contraseña de todas: `Amer2026*demo` (se puede cambiar con `--password`). La cuenta de Paula
Ruiz está inactiva a propósito: es la que permite probar el CA-3 de la HU-001.

> Estas credenciales sólo valen para las bases de datos locales y de prueba. En cualquier
> entorno real las cuentas las crea un administrador (HU-019) con contraseñas propias.

## Regla para adelante

1. Ningún dato real de clientes entra al repositorio, ni en código, ni en fixtures, ni en capturas
   de las pruebas E2E.
2. Los datos de prueba se generan con `factory_boy`/`Faker` en el backend y con un *seed* controlado.
3. Si se necesita reproducir un caso real, se anonimiza antes de guardarlo (ver
   `.claude/skills/datos-y-migraciones/SKILL.md`).
4. Base legal: Ley 1581 de 2012 y Decreto 1074 de 2015 — tratamiento de datos personales.
