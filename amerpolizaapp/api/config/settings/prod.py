"""Entorno de producción."""

import os

from .base import *  # noqa: F403
from .base import SECRET_KEY

DEBUG = False
ALLOWED_HOSTS = [h for h in os.environ.get("DJANGO_ALLOWED_HOSTS", "").split(",") if h]

# La SPA y el API se sirven bajo el mismo dominio (design.md D2): la cookie de sesión
# viaja como cookie de primera parte y no hace falta CORS con credenciales.
SESION_COOKIE_SECURE = True

SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True

if not SECRET_KEY:
    raise RuntimeError("DJANGO_SECRET_KEY es obligatoria en producción.")

# El JWT de la sesión se firma con esta clave: HS256 pide 32 bytes como mínimo (RFC 7518).
if len(SECRET_KEY.encode()) < 32:
    raise RuntimeError("DJANGO_SECRET_KEY debe tener al menos 32 bytes.")
