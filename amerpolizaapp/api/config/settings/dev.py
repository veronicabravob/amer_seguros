"""Entorno de desarrollo."""

import os
from datetime import timedelta

from .base import *  # noqa: F403
from .base import BASE_DIR, DATABASES, SECRET_KEY

# Las pruebas E2E usan su propia base para no pisar la de desarrollo.
if os.environ.get("AMER_DB"):
    DATABASES["default"]["NAME"] = BASE_DIR / f"db.{os.environ['AMER_DB']}.sqlite3"

# Las pruebas E2E acortan la ventana de RN-2 para poder comprobar que el bloqueo vence sin
# esperar 15 minutos reales. El valor real vive en base.py y lo fijan las pruebas unitarias;
# esta llave sólo existe en la configuración de desarrollo, nunca en la de producción.
if os.environ.get("AMER_VENTANA_BLOQUEO_SEGUNDOS"):
    INGRESO_VENTANA_BLOQUEO = timedelta(seconds=int(os.environ["AMER_VENTANA_BLOQUEO_SEGUNDOS"]))

DEBUG = True
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "testserver"]

# En desarrollo no hay HTTPS y la SPA llega por el proxy de Vite (mismo origen).
SESION_COOKIE_SECURE = False

if not SECRET_KEY:
    SECRET_KEY = "clave-solo-para-desarrollo-no-usar-en-produccion"  # noqa: S105
