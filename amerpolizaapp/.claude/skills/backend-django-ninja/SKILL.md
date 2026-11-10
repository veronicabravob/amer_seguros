---
name: backend-django-ninja
description: Convenciones del backend en Python con Django y Django Ninja para AMER Pólizas. Úsala siempre que crees o modifiques modelos, esquemas, endpoints, servicios o configuración del API en api/. Define la estructura de carpetas, el estilo de los endpoints, la validación y el manejo de errores.
---

# Backend — Django + Django Ninja

## Estructura

```
api/
├── manage.py
├── pyproject.toml            # dependencias con uv o poetry
├── config/                   # settings, urls, asgi
│   └── settings/{base,dev,prod}.py
├── apps/
│   ├── core/                 # modelos base, auditoría, utilidades
│   ├── usuarios/             # usuario, roles, permisos, autenticación
│   ├── catalogos/            # aseguradoras, ramos, coberturas, motivos, sedes…
│   ├── clientes/
│   ├── polizas/              # pólizas, anexos, archivos, siniestros, cobros
│   └── comisiones/
└── tests/
```

Cada app: `models.py`, `schemas.py` (Pydantic/Ninja), `services.py` (lógica de negocio),
`api.py` (router), `tests/`.

## Reglas

1. **La lógica de negocio vive en `services.py`,** no en los endpoints ni en los modelos.
   Un endpoint valida entrada, llama al servicio y devuelve el esquema de salida.
2. **Un router por app,** montado en `config/urls.py` con prefijo `/api/<recurso>`.
3. **Esquemas explícitos** de entrada y de salida: nunca se devuelve el modelo crudo.
4. **Dinero con `Decimal`**, nunca `float`. Redondeo al peso sólo al presentar.
   Campos monetarios: `DecimalField(max_digits=14, decimal_places=2)`.
5. **Errores de negocio** con una excepción propia (`ReglaDeNegocio`) traducida por un
   *exception handler* a `409` con `{codigo, mensaje, campo}`. Validación de formato → `422`.
   Sin permiso → `403`. Sin sesión → `401`.
6. **Autenticación** con token; todos los routers exigen `auth=` salvo `/api/auth/login`.
7. **Permisos por rol** verificados en el backend, siempre (ver HU-020).
8. **Auditoría**: los modelos heredan de `ModeloAuditable` (creado_por, creado_en,
   actualizado_por, actualizado_en); los cambios relevantes escriben en la bitácora.
9. **Multi-sede/agencia**: toda consulta filtra por la agencia del usuario autenticado.
10. **Nombres en español** para modelos y campos del dominio (`Poliza.prima_neta`),
    porque las HU y las specs están en español.

## Endpoint tipo

```python
@router.post("/", response={201: PolizaOut}, auth=sesion)
def crear_poliza(request, data: PolizaIn):
    poliza = services.crear_poliza(usuario=request.auth, data=data)
    return 201, poliza
```

## Antes de dar por terminado

- `python manage.py makemigrations --check` no debe reportar cambios pendientes.
- `ruff check` y `ruff format --check` limpios.
- Pruebas de la app en verde (ver skill `pruebas-unitarias`).
- El endpoint aparece documentado en `/api/docs` con ejemplos de entrada y salida.
